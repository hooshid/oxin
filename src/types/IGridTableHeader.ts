/**
 * GridTable header types
 */
export default interface IGridTableHeader {
  /**
   * Field key -> equal to model
   */
  key: string;

  /**
   * Title is label in header
   */
  title: string;

  /**
   * Column visibility in grid table = default true
   */
  visible?: boolean;

  /**
   * Column can be sort = default true
   */
  sortable?: boolean;

  /**
   * Search type
   */
  searchType?: "string" | "numeric" | "date" | "boolean" | "select";

  /**
   * Search options
   */
  searchOptions?: {
    /**
     * Get url items for select list
     */
    getUrlItems?: string;

    /**
     * Cache TTL for items
     */
    cacheTime?: string;

    /**
     * JSON items for select
     */
    searchItems?: Array<{ title: string; value: string }>;
  };

  /**
   * Field structure and customization
   */
  field?: object;
}
