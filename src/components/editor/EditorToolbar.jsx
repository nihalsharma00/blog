import { useCallback, useState } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code, Link as LinkIcon, Image as ImageIcon,
  List, ListOrdered, Quote, Minus, Undo2, Redo2, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight
} from 'lucide-react';

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`p-1.5 rounded-lg text-sm transition-all duration-150 ${
        active
          ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200'
      } disabled:opacity-30 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700 mx-0.5" />;
}

export function EditorToolbar({ editor }) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const setLink = useCallback(() => {
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run();
    } else if (/^https?:\/\//.test(linkUrl)) {
      editor.chain().focus().setLink({ href: linkUrl, target: '_blank', rel: 'noopener noreferrer' }).run();
    }
    setLinkUrl('');
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const addImage = useCallback(() => {
    if (imageUrl && /^https?:\/\//.test(imageUrl)) {
      editor.chain().focus().setImage({ src: imageUrl, alt: 'Article image' }).run();
    }
    setImageUrl('');
    setShowImageInput(false);
  }, [editor, imageUrl]);

  if (!editor) return null;

  return (
    <div className="border-b border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/60">
      <div className="flex items-center flex-wrap gap-0.5 p-2">
        {/* History */}
        <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
          <Undo2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
          <Redo2 className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Headings */}
        <ToolbarButton title="Heading 2" active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Heading 3" active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Inline formatting */}
        <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Alignment */}
        <ToolbarButton title="Align left" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Align center" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Align right" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Lists */}
        <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Ordered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Blockquote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quote className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        {/* Link */}
        <ToolbarButton title="Add link" active={editor.isActive('link')} onClick={() => setShowLinkInput(p => !p)}>
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton title="Add image URL" onClick={() => setShowImageInput(p => !p)}>
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); setLink(); } if (e.key === 'Escape') setShowLinkInput(false); }}
            placeholder="https://example.com"
            className="input text-sm py-1.5 flex-1"
            autoFocus
            aria-label="Link URL"
          />
          <button type="button" onClick={setLink} className="btn-primary text-xs py-1.5 px-3">Add</button>
          <button type="button" onClick={() => setShowLinkInput(false)} className="btn-outline text-xs py-1.5 px-3">Cancel</button>
        </div>
      )}

      {/* Image URL input */}
      {showImageInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-t border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addImage(); } if (e.key === 'Escape') setShowImageInput(false); }}
            placeholder="https://example.com/image.jpg"
            className="input text-sm py-1.5 flex-1"
            autoFocus
            aria-label="Image URL"
          />
          <button type="button" onClick={addImage} className="btn-primary text-xs py-1.5 px-3">Insert</button>
          <button type="button" onClick={() => setShowImageInput(false)} className="btn-outline text-xs py-1.5 px-3">Cancel</button>
        </div>
      )}
    </div>
  );
}
