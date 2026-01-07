import { Endpoint } from '@prisma/client';

export const PERSONA_TEMPLATES: Record<string, string> = {
  senior: `You are a Senior Backend Engineer. Your task is to design and implement the API endpoint exactly as specified, focusing on correctness, clarity, and maintainability.`,
  staff: `You are a Staff Engineer. Your task is to design the endpoint with strong architecture decisions, clean boundaries, and production-grade patterns.`,
  security: `You are a Security-minded Backend Engineer. Your task is to implement the endpoint safely (authZ/authN, validation, least privilege), and avoid insecure defaults.`,
  "api-designer": `You are an API Designer. Your task is to ensure a contract-first approach, consistent request/response shapes, and stable version-friendly design.`,
};

export const LABELS: Record<string, string> = {
    cleanCode: "Clean Code",
    bestPractice: "Best Practices",
    noExtraComments: "No Extra Comments",
    unitTests: "Unit Tests",
    apiTests: "API Tests"
};

export function generatePromptContent(endpoint: Endpoint): string {
  const personaKey = endpoint.personaKey || 'senior';
  const systemPrompt = PERSONA_TEMPLATES[personaKey] || PERSONA_TEMPLATES['senior'];
  


  const roles = (endpoint.roles as string[]) || [];
  const rolesLine = roles.length > 0 ? roles.join(', ') : 'not specified';
  
  let authLine = endpoint.security || 'public';
  if (endpoint.security === 'secure') {
      authLine += endpoint.authMechanism 
        ? ` (${endpoint.authMechanism})` 
        : ' (mechanism not specified)';
  }

  // Request & Body
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reqBody = endpoint.requestSpec as any;
  const hasReqBody = reqBody && Object.keys(reqBody).length > 0;
  
  let requestSection = '# Request\n';
  if (hasReqBody) {
     requestSection += `- Body: object\n- Body fields:\n${JSON.stringify(reqBody, null, 2)}`;
  } else {
     requestSection += `- Body: object
- Body fields: NOT SPECIFIED (properties list is empty)
Instructions: implement the endpoint without assuming body fields. If body is required, return a validation error describing missing contract details.`;
  }
  
  // Query & Headers
  if (endpoint.requestQuery && Object.keys(endpoint.requestQuery as object).length > 0) {
      requestSection += `\n\n# Query Parameters:\n${JSON.stringify(endpoint.requestQuery, null, 2)}`;
  }
  if (endpoint.requestHeaders && Object.keys(endpoint.requestHeaders as object).length > 0) {
      requestSection += `\n\n# Headers:\n${JSON.stringify(endpoint.requestHeaders, null, 2)}`;
  }

  // Response
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resBody = endpoint.responseSpec as any;
  const hasResBody = resBody && Object.keys(resBody).length > 0;
  
  let responseSection = '# Response\n';
  if (hasResBody) {
      // Check if the user has defined manually keys that look like status codes
      // If it's a standard schema it has "type", "properties" etc at root.
      // If it's a map of codes, it has "200", "400" etc.
      // We assume if it has "type", it's the success response.
      if (resBody.type || resBody.properties) {
           responseSection += `- Success response:\n${JSON.stringify(resBody, null, 2)}\n`;
      } else {
           // It might be a map of codes
           responseSection += `- Defined Responses:\n${JSON.stringify(resBody, null, 2)}\n`;
      }
  } else {
      responseSection += `- Success response: NOT SPECIFIED
Instructions: return a minimal success response with status 200 and JSON \`{ "ok": true }\` unless the endpoint contract is defined otherwise.\n`;
  }
  
  // Errors
  responseSection += '- Errors:';
  
  // We can try to detect overrides if resBody has "401" keys, but for now we append defaults if secure
  // The user asked: "if I add 401 and 403 handles from the ui, it should override the default response"
  // Since we don't have a structured error UI yet, we proceed with defaults for secure.
  if (endpoint.security === 'secure') {
      // Basic check if 401/403 mentions exist in the custom response spec string to avoid duplication
      // (This is a loose check)
      const resString = JSON.stringify(resBody);
      if (!resString.includes('"401"')) {
        responseSection += `\n  - 401 if unauthenticated (secure endpoint)`;
      }
      if (!resString.includes('"403"')) {
        responseSection += `\n  - 403 if unauthorized (when roles are later defined)`;
      }
  }
  
  // User Preferences
  const prefs = Object.entries(endpoint.promptPrefs as object || {})
    .filter(([, v]) => v)
    .map(([k]) => `- ${LABELS[k] || k}`)
    .join('\n');


  return `# System Prompt
${systemPrompt}

# Context
- Endpoint: ${endpoint.method} ${endpoint.path}
- Module: ${endpoint.moduleName || 'N/A'}
- Auth: ${authLine}
- Roles: ${rolesLine}
${endpoint.businessDesc ? `- Business Scenario: ${endpoint.businessDesc}` : ''}

${endpoint.techNotes ? `# Technical Notes:\n${endpoint.techNotes}\n` : ''}

${requestSection}

${responseSection}

${prefs ? `# User Preferences\n${prefs}` : ''}`;
}
