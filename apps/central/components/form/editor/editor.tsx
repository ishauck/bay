'use client'
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { cn } from '@/lib/utils';
import { useRef } from 'react';
import CustomDataSuggestionPlugin from './plugins/typeahead';
import { LexicalEditorConfig } from '@/constants';
import { EditorSetter } from './plugins/EditorSetter';
import { SerializedLexicalState } from '@/types/api/form-data';
import { EditorDataSetter } from './plugins/EditorDataSetter';

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

export function Editor({ editable = true, defaultData }: { editable: boolean, defaultData: SerializedLexicalState | null }) {
  const initialConfig: InitialConfigType = {
    ...LexicalEditorConfig,
    namespace: 'MyEditor',
    editable,
    onError,
  };
  const editorContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={editorContainerRef} className="h-full flex flex-col flex-1 relative">
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className={cn(
                "h-full",
                "mt-4",
                "flex-1",
                "focus:outline-none"
              )}
              aria-placeholder={
                'Enter some text, or press / to add a block...'
              }
              placeholder={
                <p className="absolute top-4 left-0 text-muted-foreground">
                  Enter some text, or press / to add a block...
                </p>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <CustomDataSuggestionPlugin />
        <EditorSetter />
        <EditorDataSetter defaultData={defaultData} />
      </LexicalComposer>
    </div>
  );
}