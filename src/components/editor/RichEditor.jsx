import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import CharacterCount from '@tiptap/extension-character-count';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import { EditorToolbar } from './EditorToolbar';

const WORD_LIMIT = 10000;

export function RichEditor({ value, onChange, placeholder = 'Write your story…' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({
        openOnClick: false,
        validate: href => /^https?:\/\//.test(href),
      }),
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: WORD_LIMIT }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'rich-editor-content focus:outline-none min-h-[300px] max-w-none',
        'aria-label': 'Article content editor',
        role: 'textbox',
        'aria-multiline': 'true',
      },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  const wordCount = editor?.storage.characterCount.words() || 0;
  const charCount = editor?.storage.characterCount.characters() || 0;

  return (
    <div className="border border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all">
      <EditorToolbar editor={editor} />
      <div className="px-4 py-3 bg-white dark:bg-[#0f0f13]">
        <EditorContent editor={editor} />
      </div>
      {editor && (
        <div className="flex items-center justify-end gap-4 px-4 py-2 text-xs text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
          <span>{wordCount} words</span>
          <span>{charCount} / {WORD_LIMIT} chars</span>
        </div>
      )}
    </div>
  );
}
