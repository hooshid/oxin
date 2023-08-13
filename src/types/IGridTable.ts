import type IGridTableHeader from "./IGridTableHeader";

/**
 * GridTable types
 */
export default interface IGridTable {
  /**
   * Headers
   */
  headers: Array<IGridTableHeader>;

  /**
   * Options
   */
  options: {
    /**
     * Url to get data from server
     */
    getUrl: string;

    /**
     * Hide toolbar = default false
     */
    hideToolbar?: boolean;

    /**
     * Hide footer = default false
     */
    hideFooter?: boolean;

    /**
     * Fix height = default true
     */
    fixHeight?: boolean;
  };
}
