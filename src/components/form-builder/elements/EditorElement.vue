<script setup lang="ts">
import type IFormBuilderField from "../../../types/IFormBuilderField";
import { ref } from "vue";
import { useField } from "vee-validate";

import CKEditor from "@ckeditor/ckeditor5-vue";
import "@ckeditor/ckeditor5-build-classic/build/translations/fa";
import { ClassicEditor } from "@ckeditor/ckeditor5-editor-classic";
import { Alignment } from "@ckeditor/ckeditor5-alignment";
import { Autoformat } from "@ckeditor/ckeditor5-autoformat";
import { Bold, Code, Italic, Strikethrough, Subscript, Superscript, Underline } from "@ckeditor/ckeditor5-basic-styles";
import { BlockQuote } from "@ckeditor/ckeditor5-block-quote";
import { CodeBlock } from "@ckeditor/ckeditor5-code-block";
import { Essentials } from "@ckeditor/ckeditor5-essentials";
import { FontBackgroundColor, FontColor, FontSize } from "@ckeditor/ckeditor5-font";
import { Heading } from "@ckeditor/ckeditor5-heading";
import { Highlight } from "@ckeditor/ckeditor5-highlight";
import { HorizontalLine } from "@ckeditor/ckeditor5-horizontal-line";
import { HtmlEmbed } from "@ckeditor/ckeditor5-html-embed";
import { DataFilter, DataSchema, GeneralHtmlSupport, HtmlComment } from "@ckeditor/ckeditor5-html-support";
import {
  AutoImage,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
} from "@ckeditor/ckeditor5-image";
import { Indent, IndentBlock } from "@ckeditor/ckeditor5-indent";
import { AutoLink, Link, LinkImage } from "@ckeditor/ckeditor5-link";
import { List, ListProperties } from "@ckeditor/ckeditor5-list";
import { MediaEmbed } from "@ckeditor/ckeditor5-media-embed";
import { Paragraph } from "@ckeditor/ckeditor5-paragraph";
import { PasteFromOffice } from "@ckeditor/ckeditor5-paste-from-office";
import { RemoveFormat } from "@ckeditor/ckeditor5-remove-format";
import { SelectAll } from "@ckeditor/ckeditor5-select-all";
import { ShowBlocks } from "@ckeditor/ckeditor5-show-blocks";
import { SourceEditing } from "@ckeditor/ckeditor5-source-editing";
import {
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
} from "@ckeditor/ckeditor5-table";
import { SimpleUploadAdapter } from "@ckeditor/ckeditor5-upload";

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

const model = props.parentModel
  ? props.parentModel + "." + props.field.model
  : (props.field.model as string);

// Validation settings
const { value, errorMessage, handleChange } = useField(
  model,
  props.field.validation,
  {
    label: props.field.label,
  },
);

const ckeditor = CKEditor.component;
const editor = ClassicEditor;
const editorConfig = {
  plugins: [
    Alignment,
    AutoImage,
    AutoLink,
    Autoformat,
    BlockQuote,
    Bold,
    Code,
    CodeBlock,
    DataFilter,
    DataSchema,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontSize,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HorizontalLine,
    HtmlComment,
    HtmlEmbed,
    Image,
    ImageCaption,
    ImageInsert,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    Indent,
    IndentBlock,
    Italic,
    Link,
    LinkImage,
    List,
    ListProperties,
    MediaEmbed,
    Paragraph,
    PasteFromOffice,
    RemoveFormat,
    SelectAll,
    ShowBlocks,
    SimpleUploadAdapter,
    SourceEditing,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    Underline,
  ],
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "strikethrough",
      "underline",
      "link",
      "bulletedList",
      "numberedList",
      "alignment",
      "|",
      "fontColor",
      "fontBackgroundColor",
      "fontSize",
      "highlight",
      "code",
      "removeFormat",
      "|",
      "outdent",
      "indent",
      "|",
      "imageInsert",
      "mediaEmbed",
      "insertTable",
      "blockQuote",
      "horizontalLine",
      "undo",
      "redo",
      "|",
      "superscript",
      "subscript",
      "codeBlock",
      "htmlEmbed",
      "|",
      "selectAll",
      "showBlocks",
      "sourceEditing",
    ],
    shouldNotGroupWhenFull: true,
  },
  language: "fa",
  image: {
    toolbar: [
      "imageTextAlternative",
      "toggleImageCaption",
      "imageStyle:inline",
      "imageStyle:block",
      "imageStyle:side",
      "linkImage",
    ],
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableCellProperties",
      "tableProperties",
    ],
  },
  simpleUpload: {
    uploadUrl: import.meta.env.VITE_OXIN_EDITOR_UPLOAD_URL,
    withCredentials: true,
    headers: {
      //'X-CSRF-TOKEN': 'CSRF-Token',
      Authorization: "Bearer " + localStorage.getItem("Authorization"),
    },
  },
};
</script>

<template>
  <div>
    <label class="d-block mb-2">{{ props.field.label }}</label>
    
    <ckeditor :editor="editor" :model-value="value || ''" @update:model-value="handleChange" :config="editorConfig" tag-name="textarea" />

    <div class="v-messages" style="--v-medium-emphasis-opacity: 1">
      <div
        style="color: rgb(var(--v-theme-error)); min-height: 16px"
        class="mb-2 mt-2 v-messages__message"
      >
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<style>
.ck {
  --ck-border-radius: 4px;
  --ck-color-base-border: hsl(0deg 0% 67.06%);
  --ck-color-toolbar-border: hsl(0deg 0% 67.06%);
  --ck-color-toolbar-background: #e1e1e1;
  --ck-z-modal: 2500;
}

.ck.ck-powered-by-balloon,
.ck.ck-powered-by {
  display: none !important;
}

.ck.ck-content.ck-editor__editable_inline p {
  padding: 4px;
}

.ck.ck-tooltip__text,
.ck.ck-button,
.ck.ck-button__label {
  font-family: iranyekan, Tahoma, Arial, serif;
}
</style>
