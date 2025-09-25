import React, { useRef, useCallback, useState, useEffect } from 'react';
import type { EditorState } from './types';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Header from './components/Header';
import { DownloadIcon, SpinnerIcon } from './components/icons';
import { useHistory } from './hooks/useHistory';
import { useDebounce } from './hooks/useDebounce';

// Access htmlToImage from the window object loaded via CDN
declare global {
  interface Window {
    htmlToImage: any;
  }
}

const initialEditorState: EditorState = {
  postText: "Your social media post text goes here! ✨\n\nYou can customize everything on the left panel.",
  username: "@username",
  profilePic: null,
  backgroundImage: null,
  contentImage: null,
  textFillImage: null,
  styleOptions: {
    background: 'linear-gradient(145deg, #1e3a8a, #4f46e5, #9333ea)',
    textColor: '#ffffff',
    fontFamily: 'font-poppins',
    fontSize: 24,
    padding: 48,
    aspectRatio: 'aspect-square',
    textAlign: 'left',
    textShadow: {
      enabled: false,
      color: '#000000',
      blur: 0,
      offsetX: 2,
      offsetY: 2,
    },
    textOutline: {
      enabled: false,
      color: '#000000',
      width: 1,
    },
    glow: {
      enabled: false,
      color: '#00ffff',
      blur: 10,
    },
    neon: {
      enabled: false,
      color: '#ff00ff',
      blur: 15,
    },
    animation: {
      enabled: false,
      type: 'fadeIn',
      duration: 1,
      delay: 0,
    },
    advancedEffect: {
      enabled: false,
      type: 'emboss',
      lightColor: '#ffffff',
      darkColor: '#000000',
      intensity: 1,
      borderColor: '#ffffff',
    },
  },
  filters: {
    grayscale: 0,
    sepia: 0,
    invert: 0,
    brightness: 100,
    contrast: 100,
  },
  gradientOptions: {
    start: '#1e3a8a',
    end: '#4f46e5',
    angle: 145,
  },
  contentImageOptions: {
    position: 'below',
    objectFit: 'contain',
    rounded: 'lg',
  },
};

type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved';
const AUTO_SAVE_KEY = 'social-post-auto-save';

const App: React.FC = () => {
  const { 
    state: editorState, 
    setState: setEditorState, 
    undo, 
    redo, 
    canUndo, 
    canRedo,
    reset,
  } = useHistory<EditorState>(initialEditorState);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const previewRef = useRef<HTMLDivElement>(null);

  const debouncedEditorState = useDebounce(editorState, 1500);

  // Effect to check for an auto-saved session on initial load
  useEffect(() => {
    try {
        const savedSessionJSON = localStorage.getItem(AUTO_SAVE_KEY);
        if (savedSessionJSON) {
            if (window.confirm("You have an unsaved session. Would you like to restore it?")) {
                const savedState = JSON.parse(savedSessionJSON);
                reset(savedState);
                setSaveStatus('saved');
            } else {
                localStorage.removeItem(AUTO_SAVE_KEY); // Clear if user declines
            }
        }
    } catch (error) {
        console.error("Failed to load auto-saved session:", error);
        localStorage.removeItem(AUTO_SAVE_KEY);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount


  // Effect to track changes and set status to 'unsaved'
  const isInitialMount = useRef(true);
  useEffect(() => {
      // Don't mark as unsaved on the very first render or right after restoring
      if (isInitialMount.current || saveStatus === 'saved') {
          isInitialMount.current = false;
          return;
      }
      if (saveStatus !== 'unsaved') {
          setSaveStatus('unsaved');
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorState]);

  // Effect for auto-saving the debounced state
  useEffect(() => {
      if (saveStatus !== 'unsaved' || isInitialMount.current) return;
      
      setSaveStatus('saving');
      try {
          const stateToSave = JSON.stringify(debouncedEditorState);
          localStorage.setItem(AUTO_SAVE_KEY, stateToSave);
          setTimeout(() => {
              setSaveStatus('saved');
          }, 500);
      } catch (error) {
          console.error("Failed to auto-save session:", error);
          setSaveStatus('unsaved');
      }
  }, [debouncedEditorState, saveStatus]);


  const handleGenerateImage = useCallback(async () => {
    if (!previewRef.current) {
      alert("Preview element is not available.");
      return;
    }
    if (!window.htmlToImage) {
        alert("Image generation library is not loaded. Please check your internet connection and refresh.");
        return;
    }

    setIsLoading(true);
    try {
      const dataUrl = await window.htmlToImage.toPng(previewRef.current, {
        quality: 1,
        pixelRatio: 2, // for higher resolution
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `social-post-${Date.now()}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('An error occurred while generating the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Editor
            editorState={editorState}
            setEditorState={setEditorState}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            saveStatus={saveStatus}
          />
          <div className="flex flex-col items-center justify-start lg:sticky lg:top-10 h-max">
            <p className="text-sm text-gray-400 mb-4 text-center">Live Preview</p>
            <div className="w-full max-w-xl mx-auto">
                <Preview
                    ref={previewRef}
                    editorState={editorState}
                />
            </div>
            <button
              onClick={handleGenerateImage}
              disabled={isLoading}
              className="mt-8 inline-flex items-center justify-center px-8 py-3 font-semibold text-white bg-cyan-500 rounded-lg shadow-lg hover:bg-cyan-600 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 disabled:bg-cyan-700/80 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="mr-3" />
                  Generating...
                </>
              ) : (
                <>
                  <DownloadIcon /> Download Image
                </>
              )}
            </button>
            <div className="mt-8 w-full max-w-xl mx-auto">
              <a 
                href="mailto:patadiaaryan15@gmail.com?subject=Inquiry about Ad Space on Social Post Generator"
                target="_blank"
                rel="noopener noreferrer"
                title="Click to inquire about advertising"
                className="block w-full p-6 text-center border-2 border-dashed border-gray-600 rounded-lg hover:border-cyan-500 hover:bg-gray-800/50 transition-all"
              >
                <span className="text-gray-500 font-semibold tracking-wider">Your Ad Here</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;