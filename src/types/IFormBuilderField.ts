/**
 * FormBuilder component schema
 */
export default interface IFormBuilderField {
  /**
   * Field model
   */
  model?: string;

  /**
   * Field type
   */
  type?: string;

  /**
   * Field label
   */
  label?: string;

  /**
   * Field validation
   */
  validation?: string;

  col?: string | number;

  rows?: string | number;

  default?: Array<number | string> | string | number | boolean | null;

  placeholder?: string;

  hint?: string;

  class?: string;

  inputType?: string;

  color?: string;

  options?: any;

  conditions?: any;

  items?: Array<object>;

  /**
   * Disabled input
   */
  disabled?: boolean;

  readonly?: boolean;

  clearable?: boolean;

  chips?: boolean;

  closableChips?: boolean;

  multiple?: boolean;

  /**
   * Disabled only on edit mode
   */
  disabledOnEdit?: boolean;

  schema?: Array<IFormBuilderField>;

  html?: string;

  /**
   * For chip group
   */
  filter?: boolean;
  mandatory?: boolean;

  variant?: string | any;

  // input icons
  prependIcon?: string;
  prependInnerIcon?: string;
  appendIcon?: string;
  appendInnerIcon?: string;

  /**
   * Hide field
   */
  hide?: boolean;


  /**
   * Config for repeat blocks
   */
  configs:{
    getUrl: string,
    saveTo: string,
    foreignKey: string,
    foreignPivotKey: string,
  },
}
