export default function DocsPage() {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6">Documentation</h1>
        
        <div className="space-y-8">
          <section className="bg-white dark:bg-[#1e2936] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Getting Started</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl leading-relaxed">
        This tool helps you architect API endpoints and automatically generate the perfect 
        <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-1 rounded mx-1">System Prompt</span> 
        for your LLM (v0, Cursor, GPT-4o). Define your schema, and we&apos;ll build the instructions.
      </p>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><strong>Create a Project:</strong> Organize your endpoints into logical groups (e.g., E-commerce, Auth Service).</li>
              <li><strong>Define Endpoints:</strong> Specify paths, methods, request/response schemas, and business logic.</li>
              <li><strong>Generate Prompts:</strong> We automatically construct a detailed System Prompt for your AI coding assistant (Cursor, Copilot, etc.).</li>
            </ol>
          </section>
  
          <section className="bg-white dark:bg-[#1e2936] p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Features</h2>
            <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300">
              <li><strong>Schema Designer:</strong> Visual editor for JSON schemas (Request/Response bodies).</li>
              <li><strong>Persona Selection:</strong> Choose between &quot;Senior Engineer&quot;, &quot;Staff Engineer&quot;, or &quot;Security Expert&quot; personas to tailor the AI&apos;s output.</li>
              <li><strong>Live Preview:</strong> See the generated prompt update in real-time as you edit the specification.</li>
              <li><strong>Theme Support:</strong> Toggle between Light and Dark modes for comfortable viewing.</li>
            </ul>
          </section>
        </div>
      </div>
    );
  }
