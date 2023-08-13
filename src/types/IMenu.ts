/**
 * Menu interface
 */
export default interface IMenu {
  /**
   * ID
   */
  id: number;

  /**
   * Parent ID
   */
  parent_id: number;

  /**
   * Menu title
   */
  title: string;

  /**
   * URL
   */
  url: string;

  /**
   * Icon
   */
  icon?: string;

  /**
   * Active state
   */
  active: boolean;

  /**
   * Children
   */
  children: Array<IMenu>;
}
