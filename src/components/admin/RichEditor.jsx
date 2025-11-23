import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";

export default function RichEditor({ value, onChange, onInsertVariable }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Paragraph,
      Heading.configure({ levels: [1, 2, 3] }),
      Image.configure({ inline: false }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Fonction d’insertion variable {{FIELD}}
  useEffect(() => {
    if (!onInsertVariable) return;
    onInsertVariable((variable) => {
      editor.chain().focus().insertContent(`{{${variable}}}`).run();
    });
  }, [editor]);

  const uploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
    };
  };

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="flex gap-2 border-b p-2 bg-gray-50">
        <button onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>

        <button onClick={() => editor.chain().focus().setTextAlign("left").run()}>
          Left
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()}>
          Center
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()}>
          Right
        </button>

        <button onClick={uploadImage}>Image</button>
      </div>

      <EditorContent editor={editor} className="p-3 min-h-[200px]" />
    </div>
  );
}
