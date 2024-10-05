<script setup lang="ts">
import type IFormBuilderField from "../../../types/IFormBuilderField";
import { useField } from "vee-validate";

import CKEditor from "@ckeditor/ckeditor5-vue";
import coreTranslations from 'ckeditor5/translations/fa.js';
import {
  ClassicEditor,
  Alignment,
  Autoformat,
  Bold,
  Code,
  Italic,
  Strikethrough,
  Subscript,
  Superscript,
  Underline,
  BlockQuote,
  CodeBlock,
  Essentials,
  FontBackgroundColor,
  FontColor,
  FontSize,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlEmbed,
  DataFilter,
  DataSchema,
  GeneralHtmlSupport,
  HtmlComment,
  AutoImage,
  Image,
  ImageCaption,
  ImageInsert,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  Indent,
  IndentBlock,
  AutoLink,
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
  SourceEditing,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  SimpleUploadAdapter
} from "ckeditor5";
import 'ckeditor5/ckeditor5.css';

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
      "|", "bold", "italic", "strikethrough", "underline", "link", "bulletedList", "numberedList", "alignment",
      "|", "fontColor", "fontBackgroundColor", "fontSize", "highlight", "code", "removeFormat",
      "|", "outdent", "indent",
      "|", "imageInsert", "mediaEmbed", "insertTable", "blockQuote", "horizontalLine", "undo", "redo",
      "|", "superscript", "subscript", "codeBlock", "htmlEmbed",
      "|", "selectAll", "showBlocks", "sourceEditing",
    ],
    shouldNotGroupWhenFull: true,
  },
  language: "fa",
  translations: [
    coreTranslations,
  ],
  link: {
    decorators: {
      openInNewTab: {
        mode: "manual",
        label: "Open in a new tab",
        attributes: {
          target: "_blank",
        },
      },
      toggleDownloadable: {
        mode: "manual",
        label: "Downloadable",
        attributes: {
          download: "file",
        },
      },
      toggleNoopenerNoreferrer: {
        mode: "manual",
        label: "لینک خارجی (noopener noreferrer)",
        attributes: {
          rel: "noopener noreferrer",
        },
      },
    },
  },
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
    withCredentials: false,
    headers: {
      Authorization: "Bearer " + (localStorage.getItem("Authorization") || localStorage.getItem("token")),
    },
  },
  mediaEmbed: {
    previewsInData: true,
    providers: [
      {
        name: 'youtube',
        url: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/,
        html: match => {
          const id = match[0].split('v=')[1];
          return (
            '<div class="embed-responsive embed-responsive-16by9">' +
            `<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/${ id }" allowfullscreen></iframe>` +
            '</div>'
          );
        }
      },
      {
        name: 'aparat',
        url: /^(https?:\/\/)?(www\.)?(aparat\.com)\/.+$/,
        html: match => {
          const id = match[0].split('/v/')[1];
          return (
            '<div class="embed-responsive embed-responsive-16by9">' +
            `<iframe class="embed-responsive-item" src="https://www.aparat.com/video/video/embed/videohash/${ id }/vt/frame" allowfullscreen></iframe>` +
            '</div>'
          );
        }
      },
      {
        name: 'directVideo',
        url: /^(https?:\/\/)?(www\.)?.+\.(mp4|webm|ogg)$/,
        html: match => {
          const url = match[0];
          return (
            '<div class="embed-responsive embed-responsive-16by9">' +
            `<video controls><source src="${ url }" type="video/mp4"></video>` +
            '</div>'
          );
        }
      }
    ]
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
  --ck-z-modal: 9999;
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
.ck.ck-button__label,
.ck.ck-label{
  font-family: iranyekan, Tahoma, Arial, serif;
}

.ck-source-editing-area {
  direction: ltr;
  text-align: left;
}

.ck.ck-content ul {
  list-style-type: disc;
  list-style-position: inside;
  padding-right: 5px;
}

.ck.ck-content ol {
  list-style-type: decimal;
  list-style-position: inside;
  padding-right: 5px;
}

.ck.ck-content ul ul, .ck.ck-content ol ul {
  list-style-type: circle;
  list-style-position: inside;
  margin-right: 15px;
}

.ck.ck-content ol ol, .ck.ck-content ul ol {
  list-style-type: lower-latin;
  list-style-position: inside;
  margin-right: 15px;
}

.ck.ck-link-form .ck-input.ck-input-text {
  text-align: left;
  direction: ltr;
}

.ck .embed-responsive {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  overflow: hidden;
}

.ck .embed-responsive::before {
  content: '';
  display: block;
  padding-top: 56.25%; /* 16:9 aspect ratio */
}

.ck .embed-responsive .embed-responsive-item,
.ck .embed-responsive iframe,
.ck .embed-responsive embed,
.ck .embed-responsive object,
.ck .embed-responsive video {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
