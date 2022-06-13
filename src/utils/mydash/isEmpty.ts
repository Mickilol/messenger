export function isEmpty(value?: any): boolean {
  switch (typeof value) {
    case 'object': {
      if (value === null) {
        return true;
      }
      
      return !(Object.keys(value) || value.length || value.size);
    }  
      
    case 'string': {
      return !value.length;
    }
      
    default:
      return true;
  }
}