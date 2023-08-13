export const inputBlocks = [
  {
    title: "ورودی متن",
    controller: "INPUT",
    icon: "mdi-form-textbox",
    value: { type: "input", model: "model", label: "عنوان" },
  },
  {
    title: "ورودی متن طولانی",
    controller: "TEXTAREA",
    icon: "mdi-form-textarea",
    value: { type: "textarea", model: "model", label: "عنوان" },
  },
  {
    title: "لیست انتخابی",
    controller: "SELECT",
    icon: "mdi-form-dropdown",
    value: {
      type: "select",
      model: "model",
      label: "عنوان",
      options: {
        getUrl: "/Controller/GenericHandler.ashx?uid=E0741634-C157-4C42-9975-2AF1ECD50F3D&sort=id&order=asc",
        cacheTime: "12h",
      },
    },
  },
  {
    title: "لیست جستجو",
    controller: "AUTOCOMPLETE",
    icon: "mdi-form-select",
    value: {
      type: "autocomplete",
      model: "model",
      label: "عنوان",
      options: {
        getUrl:
          "/Controller/GenericHandler.ashx?uid=CA272247-5F75-4ECB-873C-CF214808EC33",
        title: "full_title",
        searchField: "title",
        injectFields: { title: "place_of_issue_base_city_title" },
      },
    },
  },
  {
    title: "سویچ فعال/غیرفعال",
    controller: "SWITCH",
    icon: "mdi-toggle-switch",
    value: { type: "switch", model: "model", label: "فعال باشد؟" },
  },
  {
    title: "دکمه های کنار هم",
    controller: "CHIP GROUP",
    icon: "mdi-label-multiple",
    value: {
      type: "chip-group",
      model: "model",
      label: "عنوان",
      options: {
        getUrl:
          "/Controller/GenericHandler.ashx?uid=3F4C89DB-6EF6-425C-ACDC-BE766E6F0C63&sort=id&order=asc",
        cacheTime: "12h",
      },
    },
  },
  /*
    {
      title: "چک باکس",
    controller: "CHECKBOX",
      icon: "mdi-checkbox-marked",
      value: { type: "switch", model: "model", label: "فعال باشد؟", },
    },
    {
      title: "لیست تک انتخابی",
    controller: "RADIO",
      icon: "mdi-radiobox-marked",
      value: { type: "radio", model: "model", label: "فایل" },
    },
    */
  {
    title: "ورودی تاریخ و ساعت",
    controller: "DATETIME",
    icon: "mdi-calendar-clock",
    value: {
      type: "datetime",
      model: "model",
      label: "تاریخ و ساعت",
    },
  },
  {
    title: "ورودی تاریخ",
    controller: "DATE",
    icon: "mdi-calendar",
    value: { type: "date", model: "model", label: "تاریخ" },
  },
  {
    title: "ورودی زمان",
    controller: "TIME",
    icon: "mdi-clock-time-eight-outline",
    value: { type: "time", model: "model", label: "زمان" },
  },
  {
    title: "ادیتور متن",
    controller: "EDITOR",
    icon: "mdi-circle-edit-outline",
    value: {
      type: "editor",
      model: "model",
      label: "ادیتور",
      col: 12,
    },
  },
  {
    title: "بارگذاری فایل",
    controller: "UPLOAD",
    icon: "mdi-cloud-upload",
    value: { type: "upload", model: "model", label: "فایل" },
  },
];

export const layoutBlocks = [
  /*
    {
      title: "متن ساده",
      controller: "TEXT",
      icon: "mdi-text",
      value: { type: "input", model: "model", label: "عنوان",schema: [], },
    },
    */
  {
    title: "جعبه پیغام",
    controller: "ALERT",
    icon: "mdi-message-alert-outline",
    value: {
      type: "alert",
      label: "عنوان پیغام",
      col: 12,
      options: { type: "info", border: "start" },
    },
  },
  {
    title: "خط جدا کننده",
    controller: "DIVIDER",
    icon: "mdi-format-page-break",
    value: {
      type: "divider",
      col: 12,
    },
  },
  {
    title: "فاصله",
    controller: "SPACER",
    icon: "mdi-file-presentation-box",
    value: {
      type: "html",
      label: "فاصله",
    },
  },
  {
    title: "کد HTML",
    controller: "HTML",
    icon: "mdi-code-tags",
    value: {
      type: "html",
      html: "کد HTML در اینجا قرار گیرد",
      col: 12,
    },
  },
];

export const structureBlocks = [
  {
    title: "کانتینر",
    controller: "container",
    icon: "mdi-text",
    value: { type: "container", schema: [] },
  },
  /*
    {
      title: "لیست",
      controller: "list",
      icon: "mdi-text",
      value: { type: "list", schema: [] },
    },
    */
  {
    title: "لیست تکرارشونده",
    controller: "repeatable",
    icon: "mdi-text",
    value: { type: "repeatable", schema: [] },
  },
];
