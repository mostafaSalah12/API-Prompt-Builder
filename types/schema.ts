export type FieldType = 'string' | 'number' | 'boolean' | 'object' | 'array';

export type SchemaNode = {
  id?: string; // internal UI id
  name?: string;
  type: FieldType;
  required?: boolean;
  description?: string;
  format?: string; // email, uuid, etc.
  
  // Validations
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };

  // Children
  properties?: SchemaNode[]; // for object
  items?: SchemaNode;        // for array
};
