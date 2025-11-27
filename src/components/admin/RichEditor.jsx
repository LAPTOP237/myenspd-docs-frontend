import React, { useEffect, useState, useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import FontFamily from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import CodeBlock from "@tiptap/extension-code-block";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent,
  Image as ImageIcon, Type, Highlighter,
  ChevronDown, Minus, Link2, Unlink, Table as TableIcon,
  Quote, Code, Subscript as SubIcon, Superscript as SupIcon,
  Undo2, Redo2, Eraser, Search, Maximize2, Minimize2,
  Heading1, Heading2, Heading3, FileText, X
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

const headingLevels = [
  { level: 1, label: 'Titre 1', icon: Heading1 },
  { level: 2, label: 'Titre 2', icon: Heading2 },
  { level: 3, label: 'Titre 3', icon: Heading3 },
  { level: 0, label: 'Normal', icon: FileText },
];

// ============== COMPOSANT PRINCIPAL ==============

export default function RichEditor({ value, onChange, onInsertVariable }) {
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showHighlightMenu, setShowHighlightMenu] = useState(false);
  const [showHeadingMenu, setShowHeadingMenu] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TextStyle,
      Color,
      FontSize,
      Underline,
      Subscript,
      Superscript,
      Highlight.configure({ multicolor: true }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 rounded p-2 font-mono text-sm',
        },
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

  const insertLink = () => {
    if (!linkUrl) return;
    editor.chain().focus().setLink({ href: linkUrl }).run();
    setShowLinkModal(false);
    setLinkUrl('');
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const findAndReplace = () => {
    if (!searchTerm) return;
    const content = editor.getHTML();
    const newContent = content.replace(new RegExp(searchTerm, 'g'), replaceTerm);
    editor.commands.setContent(newContent);
    setShowSearchModal(false);
  };

  const wordCount = useMemo(() => {
    if (!editor) return 0;
    const text = editor.getText();
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }, [editor?.state.doc]);

<<<<<<< HEAD
/**
 * Toggle the fullscreen mode of the editor.
 * When `isFullscreen` is true, the editor will be displayed in
 * fullscreen mode. When `isFullscreen` is false, the editor will
 * be displayed in normal mode.
 */
=======
>>>>>>> 69174f006b994b490159ffd9f99ee7bc6b13e9e1
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  const getCurrentHeading = () => {
    if (editor.isActive('heading', { level: 1 })) return 'Titre 1';
    if (editor.isActive('heading', { level: 2 })) return 'Titre 2';
    if (editor.isActive('heading', { level: 3 })) return 'Titre 3';
    return 'Normal';
  };

  return (
    <div className={`border rounded-lg bg-white shadow-sm ${isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : ''}`}>
      {/* TOOLBAR PRINCIPALE */}
      <div className="border-b bg-gray-50">
        {/* Ligne 1: Actions et formatage */}
        <div className="flex items-center gap-1 p-2 flex-wrap border-b">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Annuler (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Rétablir (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <div className="relative">
            <DropdownButton
              label={getCurrentHeading()}
              onClick={() => setShowHeadingMenu(!showHeadingMenu)}
            />
            {showHeadingMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowHeadingMenu(false)}
                />
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-20 w-40">
<<<<<<< HEAD
                  {headingLevels.map(({ level, label }) => (
=======
                  {headingLevels.map(({ level, label, icon: Icon }) => (
>>>>>>> 69174f006b994b490159ffd9f99ee7bc6b13e9e1
                    <button
                      key={level}
                      type="button"
                      onClick={() => {
                        if (level === 0) {
                          editor.chain().focus().setParagraph().run();
                        } else {
                          editor.chain().focus().toggleHeading({ level }).run();
                        }
                        setShowHeadingMenu(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-100"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <ToolbarDivider />

          <ToolbarButton
            onClick={clearFormatting}
            title="Effacer le formatage"
          >
            <Eraser className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <ToolbarButton
            onClick={() => setShowSearchModal(true)}
            title="Rechercher/Remplacer (Ctrl+F)"
          >
            <Search className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-gray-500">{wordCount} mots</span>
            <ToolbarButton
              onClick={toggleFullscreen}
              title={isFullscreen ? "Quitter plein écran" : "Plein écran"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </ToolbarButton>
          </div>
        </div>

        {/* Ligne 2: Police et formatage */}
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

          <ToolbarDivider />

          {/* Liens */}
          <ToolbarButton
            onClick={() => setShowLinkModal(true)}
            active={editor.isActive('link')}
            title="Insérer un lien"
          >
            <Link2 className="w-4 h-4" />
          </ToolbarButton>

          {editor.isActive('link') && (
            <ToolbarButton
              onClick={removeLink}
              title="Supprimer le lien"
            >
              <Unlink className="w-4 h-4" />
            </ToolbarButton>
          )}

          <ToolbarDivider />

          {/* Tableau */}
          <ToolbarButton
            onClick={insertTable}
            title="Insérer un tableau"
          >
            <TableIcon className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Citation */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Citation"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>

          {/* Code */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title="Code inline"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Exposant/Indice */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            active={editor.isActive('superscript')}
            title="Exposant"
          >
            <SupIcon className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            active={editor.isActive('subscript')}
            title="Indice"
          >
            <SubIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* ZONE D'ÉDITION */}
      <EditorContent
        editor={editor}
        className={`prose max-w-none p-6 focus:outline-none overflow-y-auto ${isFullscreen ? 'flex-1' : 'min-h-[400px]'}`}
      />

      {/* MODAL LIEN */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Insérer un lien</h3>
              <button
                onClick={() => setShowLinkModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              onKeyPress={(e) => e.key === 'Enter' && insertLink()}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={insertLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Insérer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RECHERCHER/REMPLACER */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Rechercher et remplacer</h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-3"
            />
            <input
              type="text"
              placeholder="Remplacer par..."
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-4"
              onKeyPress={(e) => e.key === 'Enter' && findAndReplace()}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSearchModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={findAndReplace}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Remplacer tout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}