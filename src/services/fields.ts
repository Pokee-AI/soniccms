export const getFieldDefinitions = (tableConfig, record?) => {
  const definitionObject = tableConfig.definition;

  // Convert the nested objects to an array
  const definitionArray = Object.values(definitionObject);

  const fields = Object.entries(tableConfig.fields ?? []);

  const formFields = definitionArray.map((field: { config: { name: string } }) => {
    const key = field.config.name;
    const fieldOverride = tableConfig.fields ? tableConfig.fields[key] : null;
    const fieldType = fieldOverride ? fieldOverride.type : "textField";
    const hint = fieldOverride ? fieldOverride.hint : null;

    if (record && record[key]) {
      return { key, type: fieldType, value: record[key], hint };
    } else {
      return { key, type: fieldType, hint };
    }
  });

  tableConfig.formFields = formFields;
  // console.log("formFields", formFields);
  return tableConfig;
};
