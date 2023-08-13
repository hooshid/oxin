export function conditionsMet(conditions, formData) {
  if (conditions === undefined || conditions === null) {
    return false;
  }

  // If it's not a group, just a single condition
  if (conditions.operatorIdentifier === undefined) {
    return propertyConditionMet(
      conditions.value,
      conditions.value ? formData[conditions.value.property_meta.id] : null
    );
  }

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

  throw new Error(
    "Unexcepted operatorIdentifier:" + conditions.operatorIdentifier
  );
}

function checkBefore(condition, fieldValue) {
  return condition.value && fieldValue && fieldValue > condition.value;
}

function checkAfter(condition, fieldValue) {
  return condition.value && fieldValue && fieldValue < condition.value;
}

function checkOnOrBefore(condition, fieldValue) {
  return condition.value && fieldValue && fieldValue >= condition.value;
}

function checkOnOrAfter(condition, fieldValue) {
  return condition.value && fieldValue && fieldValue <= condition.value;
}

function checkPastWeek(condition, fieldValue) {
  if (!fieldValue) return false;
  const fieldDate = new Date(fieldValue);
  const today = new Date();
  return (
    fieldDate <= today &&
    fieldDate >=
      new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
  );
}

function checkPastMonth(condition, fieldValue) {
  if (!fieldValue) return false;
  const fieldDate = new Date(fieldValue);
  const today = new Date();
  return (
    fieldDate <= today &&
    fieldDate >=
      new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
  );
}

function checkPastYear(condition, fieldValue) {
  if (!fieldValue) return false;
  const fieldDate = new Date(fieldValue);
  const today = new Date();
  return (
    fieldDate <= today &&
    fieldDate >=
      new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
  );
}

function checkNextWeek(condition, fieldValue) {
  if (!fieldValue) return false;
  const fieldDate = new Date(fieldValue);
  const today = new Date();
  return (
    fieldDate >= today &&
    fieldDate <=
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7)
  );
}

function checkNextMonth(condition, fieldValue) {
  if (!fieldValue) return false;
  const fieldDate = new Date(fieldValue);
  const today = new Date();
  return (
    fieldDate >= today &&
    fieldDate <=
      new Date(today.getFullYear(), today.getMonth() + 1, today.getDate())
  );
}

function checkNextYear(condition, fieldValue) {
  if (!fieldValue) return false;
  const fieldDate = new Date(fieldValue);
  const today = new Date();
  return (
    fieldDate >= today &&
    fieldDate <=
      new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())
  );
}

function dateConditionMet(propertyCondition, value) {
  switch (propertyCondition.operator) {
    case "equals":
      return checkEquals(propertyCondition, value);
    case "before":
      return checkBefore(propertyCondition, value);
    case "after":
      return checkAfter(propertyCondition, value);
    case "on_or_before":
      return checkOnOrBefore(propertyCondition, value);
    case "on_or_after":
      return checkOnOrAfter(propertyCondition, value);
    case "past_week":
      return checkPastWeek(propertyCondition, value);
    case "past_month":
      return checkPastMonth(propertyCondition, value);
    case "past_year":
      return checkPastYear(propertyCondition, value);
    case "next_week":
      return checkNextWeek(propertyCondition, value);
    case "next_month":
      return checkNextMonth(propertyCondition, value);
    case "next_year":
      return checkNextYear(propertyCondition, value);
  }
  return false;
}
