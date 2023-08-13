import moment from "moment-jalaali";

/**
 * Convert miladi to shamsi
 * @param date
 */
export function miladiToShamsiDate(date: unknown): string | null {
  if (typeof date == "string" && (date.length == 10 || date.length == 19 || date.length == 23)) {
    return moment(date, "YYYY-MM-DD").format("jYYYY/jMM/jDD");
  }

  return null;
}

/**
 * Convert miladi to shamsi with time
 * @param date
 */
export function miladiToShamsiDateTime(date: unknown): string | null {
  if (typeof date == "string" && (date.length == 10 || date.length == 19 || date.length == 23)) {
    return moment(date, "YYYY-MM-DD HH:mm").format("jYYYY/jMM/jDD HH:mm");
  }

  return null;
}

type TreeItem<T> = T & { children: TreeItem<T>[] };
export function buildTree<T>(array: T[], elementKey: keyof T, parentKey: keyof T): TreeItem<T>[] {
  const tree = [] as TreeItem<T>[];
  for (let i = 0; i < array.length; i++) {
    if (array[i][parentKey]) {
      const parent = array
        .filter((elem) => elem[elementKey] === array[i][parentKey])
        .pop() as TreeItem<T>;
      if (!parent["children"]) {
        parent.children = [];
      }
      parent.children.push(array[i] as TreeItem<T>);
    } else {
      tree.push(array[i] as TreeItem<T>);
    }
  }
  return tree;
}
