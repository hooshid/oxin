export function conditionsMet(conditions, formData) {
  if (!conditions || conditions === undefined || conditions === null) {
    return false;
  }
  let isvalid = true;
  conditions.forEach((item: Array<string>) => {
    const key = item[0];
    const operator = item[1];
    const value = item[2];
    const fieldValue = formData[item[0]] ? formData[item[0]] : null;

    //console.log(item);
    //console.log(formData[item[0]]);
    isvalid = propertyConditionMet(item, fieldValue);
    //return propertyConditionMet(item, fieldValue);
  });

  return isvalid;

  // If it's not a group, just a single condition
  /*
  if (conditions.operatorIdentifier === undefined) {
    return propertyConditionMet(
      conditions.value,
      conditions.value ? formData[conditions.value.property_meta.id] : null
    );
  }
*/
  /*
  if (conditions.operatorIdentifier === "and") {
    let isvalid = true;
    conditions.children.forEach((childrenCondition) => {
      if (!conditionsMet(childrenCondition, formData)) {
        isvalid = false;
      }
    });
    return isvalid;
  } else if (conditions.operatorIdentifier === "or") {
    let isvalid = false;
    conditions.children.forEach((childrenCondition) => {
      if (conditionsMet(childrenCondition, formData)) {
        isvalid = true;
      }
    });
    return isvalid;
  }
  */

  //throw new Error("Unexcepted operatorIdentifier:");
}

type IValueType = string;

function propertyConditionMet(propertyCondition: string[], value: IValueType) {
  if (!propertyCondition) {
    return false;
  }

  const conditionValue = propertyCondition[2];
  const conditionOperator = propertyCondition[1];

  switch (conditionOperator) {
    case "equals":
      return checkEquals(conditionValue, value);
    case "does_not_equal":
      return !checkEquals(conditionValue, value);
    case "contains":
      return checkContains(conditionValue, value);
    case "does_not_contain":
      return !checkContains(conditionValue, value);
    case "starts_with":
      return checkStartsWith(conditionValue, value);
    case "ends_with":
      return checkEndsWith(conditionValue, value);
    case "is_empty":
      return checkIsEmpty(conditionValue, value);
    case "is_not_empty":
      return !checkIsEmpty(conditionValue, value);
    case "content_length_equals":
      return checkLength(conditionValue, value, "===");
    case "content_length_does_not_equal":
      return checkLength(conditionValue, value, "!==");
    case "content_length_greater_than":
      return checkLength(conditionValue, value, ">");
    case "content_length_greater_than_or_equal_to":
      return checkLength(conditionValue, value, ">=");
    case "content_length_less_than":
      return checkLength(conditionValue, value, "<");
    case "content_length_less_than_or_equal_to":
      return checkLength(conditionValue, value, "<=");
    case "greater_than":
      return checkGreaterThan(conditionValue, value);
    case "less_than":
      return checkLessThan(conditionValue, value);
    case "greater_than_or_equal_to":
      return checkGreaterThanEqual(conditionValue, value);
    case "less_than_or_equal_to":
      return checkLessThanEqual(conditionValue, value);
  }

  return false;
}

function checkEquals(conditionValue: IValueType, fieldValue: IValueType) {
  return conditionValue == fieldValue;
}

function checkContains(conditionValue: IValueType, fieldValue: IValueType) {
  return fieldValue ? fieldValue.includes(conditionValue) : false;
}

function checkStartsWith(conditionValue: IValueType, fieldValue: IValueType) {
  return fieldValue && fieldValue.startsWith(conditionValue);
}

function checkEndsWith(conditionValue: IValueType, fieldValue: IValueType) {
  return fieldValue && fieldValue.endsWith(conditionValue);
}

function checkIsEmpty(conditionValue: IValueType, fieldValue: IValueType) {
  return !fieldValue || (conditionValue as unknown as number) === 0;
}

function checkLength(
  conditionValue: IValueType,
  fieldValue: IValueType,
  operator = "==="
) {
  if (!fieldValue || fieldValue.length === 0) return false;

  switch (operator) {
    case "===":
      return fieldValue.length === parseInt(conditionValue);
    case "!==":
      return fieldValue.length !== parseInt(conditionValue);
    case ">":
      return fieldValue.length > parseInt(conditionValue);
    case ">=":
      return fieldValue.length >= parseInt(conditionValue);
    case "<":
      return fieldValue.length < parseInt(conditionValue);
    case "<=":
      return fieldValue.length <= parseInt(conditionValue);
  }
  return false;
}

function checkListContains(conditionValue: IValueType, fieldValue: IValueType) {
  if (!fieldValue) return false;

  if (Array.isArray(conditionValue)) {
    return conditionValue.every((r) => fieldValue.includes(r));
  } else {
    return fieldValue.includes(conditionValue);
  }
}

function checkGreaterThan(conditionValue: IValueType, fieldValue: IValueType) {
  return (
    conditionValue &&
    fieldValue &&
    parseFloat(fieldValue) > parseFloat(conditionValue)
  );
}

function checkGreaterThanEqual(
  conditionValue: IValueType,
  fieldValue: IValueType
) {
  return (
    conditionValue &&
    fieldValue &&
    parseFloat(fieldValue) >= parseFloat(conditionValue)
  );
}

function checkLessThan(conditionValue: IValueType, fieldValue: IValueType) {
  return (
    conditionValue &&
    fieldValue &&
    parseFloat(fieldValue) < parseFloat(conditionValue)
  );
}

function checkLessThanEqual(
  conditionValue: IValueType,
  fieldValue: IValueType
) {
  return (
    conditionValue &&
    fieldValue &&
    parseFloat(fieldValue) <= parseFloat(conditionValue)
  );
}
