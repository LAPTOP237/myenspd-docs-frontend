import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent,
  Image as ImageIcon, Type, Highlighter,
  ChevronDown, Minus
} from "lucide-react";

// Extension personnalisée pour la taille de police
import { Extension } from '@tiptap/core';

const FontSize = Extension.create({
  name: 'fontSize',
  addOptions() {
    return {
      types: ['textStyle'],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: element => element.style.fontSize.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize: fontSize => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize })
          .run();
      },
      unsetFontSize: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { fontSize: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});

// ============== COMPOSANTS EXTRAITS (EN DEHORS DU RENDER) ==============

const ToolbarButton = ({ onClick, active, children, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded hover:bg-gray-200 transition-colors ${
      active ? 'bg-gray-300 text-blue-600' : 'text-gray-700'
    }`}
  >
    {children}
  </button>
);

const ToolbarDivider = () => (
  <div className="w-px h-6 bg-gray-300 mx-1" />
);

const DropdownButton = ({ icon: Icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1 px-3 py-1.5 rounded hover:bg-gray-200 text-sm text-gray-700"
  >
    {Icon && <Icon className="w-4 h-4" />}
    <span>{label}</span>
    <ChevronDown className="w-3 h-3" />
  </button>
);

// ============== DONNÉES STATIQUES ==============

const fontSizes = [
  '8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', 
  '20px', '24px', '28px', '32px', '36px', '48px', '72px'
];

const fontFamilies = [
  'Times New Roman',
  'Arial',
  'Courier New',
  'Georgia',
  'Verdana',
  'Helvetica',
  'Comic Sans MS'
];

const colors = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF',
  '#F3F3F3', '#FFFFFF', '#980000', '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF',
  '#4A86E8', '#0000FF', '#9900FF', '#FF00FF'
];

const highlightColors = [
  'transparent', '#FFF9C4', '#FFECB3', '#FFE0B2', '#FFCCBC', '#F8BBD0', 
  '#E1BEE7', '#D1C4E9', '#C5CAE9', '#BBDEFB'
];

// ============== COMPOSANT PRINCIPAL ==============

export default function RichEditor({ value, onChange, onInsertVariable }) {
  const [showFontMenu, setShowFontMenu] = React.useState(false);
  const [showSizeMenu, setShowSizeMenu] = React.useState(false);
  const [showColorMenu, setShowColorMenu] = React.useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = React.useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontSize,
      Underline,
      Highlight.configure({ multicolor: true }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Image.configure({ 
        inline: false,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Fonction d'insertion de variable
  useEffect(() => {
    if (!onInsertVariable || !editor) return;
    onInsertVariable((variable) => {
      editor.chain().focus().insertContent(`{{${variable}}}`).run();
    });
  }, [editor, onInsertVariable]);

  if (!editor) return null;

  const uploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();

    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
    };
  };

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      {/* TOOLBAR PRINCIPALE */}
      <div className="border-b bg-gray-50">
        {/* Ligne 1: Police et formatage */}
        <div className="flex items-center gap-1 p-2 flex-wrap">
          {/* Sélecteur de police */}
          <div className="relative">
            <DropdownButton
              label={editor.getAttributes('textStyle').fontFamily || 'Times New Roman'}
              isOpen={showFontMenu}
              onClick={() => setShowFontMenu(!showFontMenu)}
            />
            {showFontMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowFontMenu(false)}
                />
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-20 w-48 max-h-60 overflow-y-auto">
                  {fontFamilies.map(font => (
                    <button
                      key={font}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().setFontFamily(font).run();
                        setShowFontMenu(false);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <ToolbarDivider />

          {/* Taille de police */}
          <div className="relative">
            <DropdownButton
              label={editor.getAttributes('textStyle').fontSize || '11px'}
              isOpen={showSizeMenu}
              onClick={() => setShowSizeMenu(!showSizeMenu)}
            />
            {showSizeMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowSizeMenu(false)}
                />
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-20 w-24 max-h-60 overflow-y-auto">
                  {fontSizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().setFontSize(size).run();
                        setShowSizeMenu(false);
                      }}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <ToolbarDivider />

          {/* Gras, Italique, Souligné, Barré */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Gras (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italique (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Souligné (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Barré"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Couleur de texte */}
          <div className="relative">
            <ToolbarButton
              onClick={() => setShowColorMenu(!showColorMenu)}
              title="Couleur du texte"
            >
              <Type className="w-4 h-4" />
            </ToolbarButton>
            {showColorMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowColorMenu(false)}
                />
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-20 p-2">
                  <div className="grid grid-cols-10 gap-1">
                    {colors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          editor.chain().focus().setColor(color).run();
                          setShowColorMenu(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Surbrillance */}
          <div className="relative">
            <ToolbarButton
              onClick={() => setShowHighlightMenu(!showHighlightMenu)}
              title="Surbrillance"
            >
              <Highlighter className="w-4 h-4" />
            </ToolbarButton>
            {showHighlightMenu && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setShowHighlightMenu(false)}
                />
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-20 p-2">
                  <div className="grid grid-cols-5 gap-1">
                    {highlightColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          if (color === 'transparent') {
                            editor.chain().focus().unsetHighlight().run();
                          } else {
                            editor.chain().focus().setHighlight({ color }).run();
                          }
                          setShowHighlightMenu(false);
                        }}
                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color === 'transparent' ? 'Aucun' : color}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Ligne 2: Alignement et listes */}
        <div className="flex items-center gap-1 p-2 border-t flex-wrap">
          {/* Alignement */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="Aligner à gauche"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="Centrer"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="Aligner à droite"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            active={editor.isActive({ textAlign: 'justify' })}
            title="Justifier"
          >
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Listes */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Liste à puces"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Liste numérotée"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Indentation */}
          <ToolbarButton
            onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
            title="Augmenter le retrait"
          >
            <Indent className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().liftListItem('listItem').run()}
            title="Diminuer le retrait"
          >
            <Outdent className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Ligne horizontale */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Insérer une ligne horizontale"
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Image */}
          <ToolbarButton
            onClick={uploadImage}
            title="Insérer une image"
          >
            <ImageIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* ZONE D'ÉDITION */}
      <EditorContent 
        editor={editor} 
        className="prose max-w-none p-6 min-h-[400px] focus:outline-none"
      />
    </div>
  );
}