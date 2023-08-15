<script setup lang="ts">
import type IFormBuilderField from "../../../types/IFormBuilderField";
import type { LogLevels } from "@editorjs/editorjs";

import { onMounted, onUnmounted, ref, watch } from "vue";
import { useField } from "vee-validate";
import EditorJs from "@editorjs/editorjs";

// @ts-expect-error ignore type
import Header from "@editorjs/header";
// @ts-expect-error ignore type
import NestedList from "@editorjs/nested-list";
// @ts-expect-error ignore type
import Quote from "@editorjs/quote";
// @ts-expect-error ignore type
import RawTool from "@editorjs/raw";
// @ts-expect-error ignore type
import ImageTool from "@editorjs/image";
// @ts-expect-error ignore type
import Delimiter from "@editorjs/delimiter";
// @ts-expect-error ignore type
import Table from "@editorjs/table";
// @ts-expect-error ignore type
import Underline from "@editorjs/underline";
// @ts-expect-error ignore type
import InlineCode from "@editorjs/inline-code";
// @ts-expect-error ignore type
import Marker from "@editorjs/marker";
// @ts-expect-error ignore type
import Embed from "@editorjs/embed";

/**
 * Props
 */
const props = defineProps<{
  /**
   * Field structure
   */
  field: IFormBuilderField;

  /**
   * Parent model name
   */
  parentModel?: string;

  /**
   * ID for EditJs element
   */
  holder?: string;

  /**
   * Extra config fro editor
   */
  config?: object;
}>();

const editor = ref();
const editorIsReady = ref(false);
function initEditor(data: undefined) {
  editor.value = new EditorJs({
    logLevel: "ERROR" as LogLevels,
    holder: props.holder || "editor-holder",
    placeholder: "شروع به نوشتن کنید!",

    /**
     * Edit tools
     */
    tools: {
      paragraph: {
        config: {
          placeholder: "چیزی بنویسید!",
        },
      },
      header: {
        class: Header,
        inlineToolbar: ["link"],
        config: {
          placeholder: "سرتیتر را کنید...",
          defaultLevel: 1,
        },
      },
      quote: {
        class: Quote,
        inlineToolbar: true,
        config: {
          quotePlaceholder: "متن نقل قول",
          captionPlaceholder: "نویسنده نقل قول",
        },
      },
      list: {
        class: NestedList,
        inlineToolbar: true,
        config: {
          defaultStyle: "unordered",
        },
      },
      image: {
        class: ImageTool,
        config: {
          endpoints: {
            byFile: "/api/panel/admin/upload",
            // byUrl: "http://localhost:8008/fetchUrl", // Your endpoint that provides uploading by Url
          },
          additionalRequestHeaders: {
            Authorization: "Bearer " + localStorage.getItem("Authorization"),
          },
        },
      },
      table: {
        class: Table,
        inlineToolbar: true,
        config: {
          rows: 2,
          cols: 3,
        },
      },
      delimiter: Delimiter,
      raw: {
        class: RawTool,
        config: {
          placeholder: "کد HTML را وارد کنید",
        },
      },
      underline: Underline,
      inlineCode: InlineCode,
      marker: Marker,
      embed: {
        class: Embed,
        inlineToolbar: true,
      },
    },

    /**
     * Internationalization config
     */
    i18n: {
      /**
       * Text direction
       */
      direction: "rtl",

      /**
       * @type {I18nDictionary}
       */
      messages: {
        ui: {
          blockTunes: {
            toggler: {
              "Click to tune": "تنظیمات",
            },
          },
          inlineToolbar: {
            converter: {
              "Convert to": "تبدیل به",
            },
          },
          toolbar: {
            toolbox: {
              Add: "افزودن",
            },
          },
          popover: {
            Filter: "جستجو",
            "Nothing found": "پیدا نشد!",
          },
        },

        toolNames: {
          Text: "متن",
          Heading: "سرتیتر",
          List: "لیست",
          Underline: "زیر خط",
          Quote: "نقل قول",
          Code: "کد",
          Delimiter: "جدا کننده",
          "Raw HTML": "کد HTML",
          Table: "جدول",
          Link: "پیوند",
          Marker: "نشانگر",
          Bold: "پر رنگ",
          Italic: "مایل",
          InlineCode: "کد درون خطی",
          Image: "تصویر",
        },

        tools: {
          header: {
            "Heading 1": "سرتیتر 1",
            "Heading 2": "سرتیتر 2",
            "Heading 3": "سرتیتر 3",
            "Heading 4": "سرتیتر 4",
            "Heading 5": "سرتیتر 5",
            "Heading 6": "سرتیتر 6",
          },
          quote: {
            "Align Right": "راست چین",
            "Align Left": "چپ چین",
            "Align Center": "وسط چین",
          },
          list: {
            Ordered: "سفارشی",
            Unordered: "غیر مرتب",
          },
          link: {
            "Add a link": "آدرس لینک را وارد کنید",
          },
          image: {
            "Add Border": "حاشیه",
            "Stretch Image": "تصویر کشیده",
            "Add Background": "رنگ پس زمینه",
            "Enter a caption": "توضیحات (Caption)",
            Caption: "توضیحات (Caption)",
            "Select an Image": "یک تصویر انتخاب کنید!",
            "With border": "کادر حاشیه",
            "Stretch image": "تصویر کشیده",
            "With background": "با پس زمینه",
          },
          table: {
            "Add row above": "افزودن ردیف به بالا",
            "Add row below": "افزودن ردیف به پایین",
            "Delete row": "حذف ردیف",
            "Add column to left": "افزودن ستون به چپ",
            "Add column to right": "افزودن ستون به راست",
            "Delete column": "حذف ستون",
            "With headings": "دارای سربرگ",
            "Without headings": "بدون سربرگ",
          },
          embed: {
            "Enter a caption": "توضیحات (Caption)",
          },
        },

        blockTunes: {
          delete: {
            Delete: "حذف",
            "Click to delete": "برای حذف کلیک کنید",
          },
          moveUp: {
            "Move up": "انتقال به بالا",
          },
          moveDown: {
            "Move down": "انتقال به پایین",
          },
        },
      },
    },

    data: data,

    /**
     * onChange callback
     */
    onChange: (api) => {
      api.saver
        .save()
        .then((outputData: object) => {
          if (JSON.stringify(outputData).length < 100) {
            handleChange(null, true);
          } else {
            handleChange(JSON.stringify(outputData), true);
          }
        })
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .catch((error: string) => {
          alert("خطایی در ذخیره اطلاعات وجود دارد");
          // console.log("Saving failed: ", error);
        });
    },

    /**
     * onReady callback
     */
    onReady: () => {
      editorIsReady.value = true;
    },
  });
}

const model = props.parentModel
  ? props.parentModel + "." + props.field.model
  : (props.field.model as string);

// Validation settings
const { value, errorMessage, handleChange } = useField(
  model,
  props.field.validation,
  {
    label: props.field.label,
  }
);

// change string data to json object & init editor
onMounted(() => {
  let data = null;
  try {
    if (value && typeof value == "string") {
      data = JSON.parse(value);
    }
  } catch (error) {
    alert(error);
  }

  initEditor(data);
});

// destroy editor instance onUnmounted
onUnmounted(() => {
  if (editorIsReady.value) {
    editor.value.clear();
    editor.value.destroy();
  }
});

/**
 * Watch modelValue changes from FormBuilder -> just for reset btn
 */
watch(value, (newVal) => {
  if (editorIsReady.value && !newVal) {
    editor.value.clear();
  }
});
</script>

<template>
  <div id="editor-holder" class="editor-holder mb-4"></div>

  <div class="v-messages" style="--v-medium-emphasis-opacity: 1">
    <div
      style="color: rgb(var(--v-theme-error)); min-height: 16px"
      class="mb-2 v-messages__message"
    >
      {{ errorMessage }}
    </div>
  </div>
</template>

<style>
.editor-holder {
  border: 1px solid #aaaaaa;
  border-radius: 4px;
  max-width: 700px;
  margin: 0 auto;
}
.ce-popover__item-icon {
  margin-right: 0;
  margin-left: 10px;
}
.ce-block:hover {
  background: #f5f5f5;
}
.codex-editor__redactor {
  padding-bottom: 30px !important;
}
</style>
