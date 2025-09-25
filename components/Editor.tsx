import React, { useState, useEffect } from 'react';
import type { StyleOptions, FilterOptions, TextShadowOptions, GradientOptions, TextOutlineOptions, CustomPreset, GlowOptions, NeonOptions, EditorState, TextAnimationOptions, AdvancedTextEffectOptions, ContentImageOptions } from '../types';
import { FONT_OPTIONS, ASPECT_RATIO_OPTIONS, BACKGROUND_PRESETS, TEMPLATES } from '../types';
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  TextAlignJustifyIcon,
  UndoIcon,
  RedoIcon,
  SpinnerIcon,
  PositionAboveIcon,
  PositionBelowIcon,
  ObjectContainIcon,
  ObjectCoverIcon,
} from './icons';

type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved';

interface EditorProps {
  editorState: EditorState;
  setEditorState: (updater: (prevState: EditorState) => EditorState) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveStatus: SaveStatus;
}

const ControlWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">{title}</label>
        {children}
    </div>
);

const initialFilters: FilterOptions = {
    grayscale: 0,
    sepia: 0,
    invert: 0,
    brightness: 100,
    contrast: 100,
};

const alignmentOptions = [
    { value: 'left', icon: <TextAlignLeftIcon />, label: 'Align Left' },
    { value: 'center', icon: <TextAlignCenterIcon />, label: 'Align Center' },
    { value: 'right', icon: <TextAlignRightIcon />, label: 'Align Right' },
    { value: 'justify', icon: <TextAlignJustifyIcon />, label: 'Align Justify' },
] as const;

const backgroundTabs = [
    { id: 'presets', label: 'Presets' },
    { id: 'solid', label: 'Solid' },
    { id: 'gradient', label: 'Gradient' },
    { id: 'image', label: 'Image' },
] as const;

type BackgroundTab = typeof backgroundTabs[number]['id'];

const SaveStatusIndicator: React.FC<{ status: SaveStatus }> = ({ status }) => {
    switch (status) {
        case 'unsaved':
            return <span className="text-xs text-yellow-400">Unsaved changes...</span>;
        case 'saving':
            return (
                <span className="flex items-center text-xs text-cyan-400">
                    <SpinnerIcon className="mr-1.5 h-4 w-4" />
                    Saving...
                </span>
            );
        case 'saved':
            return <span className="text-xs text-green-400">Saved</span>;
        default:
            return <div className="h-4" />; // Placeholder to prevent layout shift
    }
};

const Editor: React.FC<EditorProps> = ({
  editorState,
  setEditorState,
  undo,
  redo,
  canUndo,
  canRedo,
  saveStatus,
}) => {
  const { 
    postText, 
    username, 
    styleOptions, 
    backgroundImage, 
    contentImage, 
    textFillImage, 
    filters, 
    gradientOptions,
    contentImageOptions,
  } = editorState;

  const [backgroundTab, setBackgroundTab] = useState<BackgroundTab>('presets');
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>([]);

  useEffect(() => {
    // Determine initial background tab based on props
    if (backgroundImage) {
        setBackgroundTab('image');
    } else if (typeof styleOptions.background === 'string' && styleOptions.background.startsWith('linear-gradient')) {
        setBackgroundTab('gradient');
    } else if (typeof styleOptions.background === 'string' && styleOptions.background.startsWith('#')) {
        setBackgroundTab('solid');
    } else {
        setBackgroundTab('presets');
    }
  }, [backgroundImage, styleOptions.background]);


  useEffect(() => {
    try {
      const savedPresets = localStorage.getItem('customSocialPresets');
      if (savedPresets) {
        setCustomPresets(JSON.parse(savedPresets));
      }
    } catch (error) {
      console.error("Failed to load custom presets:", error);
    }
  }, []);

  const handleFileChange = (field: 'profilePic' | 'backgroundImage' | 'contentImage' | 'textFillImage', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setEditorState(prev => {
          const newState: EditorState = { ...prev, [field]: result };
          if (field === 'backgroundImage') {
            newState.filters = initialFilters;
            setBackgroundTab('image');
          }
          if (field === 'textFillImage' && result) {
            newState.styleOptions = { ...prev.styleOptions, textColor: 'transparent' };
          }
          return newState;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = (field: 'profilePic' | 'backgroundImage' | 'contentImage' | 'textFillImage') => {
    setEditorState(prev => {
      const nextState = { ...prev };
      nextState[field] = null;

      if (field === 'backgroundImage') {
        nextState.filters = initialFilters;
        nextState.styleOptions = {
          ...nextState.styleOptions,
          background: '#111827'
        };
      } else if (field === 'textFillImage') {
        nextState.styleOptions = {
          ...nextState.styleOptions,
          textColor: '#ffffff' // Restore default color
        };
      }
      return nextState;
    });
  };

  const handleStyleChange = (key: keyof StyleOptions, value: any) => {
    setEditorState(prev => {
        const newStyleOptions = { ...prev.styleOptions, [key]: value };
        const newState = { ...prev, styleOptions: newStyleOptions };
        
        if (key === 'background') {
            newState.backgroundImage = null;
            newState.filters = initialFilters;
            if (typeof value === 'string') {
                if (value.startsWith('linear-gradient')) {
                    setBackgroundTab('gradient');
                } else {
                    setBackgroundTab('solid');
                }
            }
        }
        return newState;
    });
  };

  const handleFilterChange = (key: keyof FilterOptions, value: number) => {
    setEditorState(prev => ({ ...prev, filters: { ...prev.filters, [key]: value } }));
  };

  const handleContentImageOptionsChange = (key: keyof ContentImageOptions, value: any) => {
      setEditorState(prev => ({
          ...prev,
          contentImageOptions: {
              ...prev.contentImageOptions,
              [key]: value,
          },
      }));
  };
  
  const handleTextEffectChange = (
    effect: 'textShadow' | 'textOutline' | 'glow' | 'neon',
    key: string,
    value: any
  ) => {
    setEditorState(prev => ({
      ...prev,
      styleOptions: {
        ...prev.styleOptions,
        [effect]: {
          // @ts-ignore
          ...prev.styleOptions[effect],
          [key]: value
        }
      }
    }));
  };

  const handleAdvancedEffectChange = (key: keyof AdvancedTextEffectOptions, value: any) => {
    setEditorState(prev => ({
      ...prev,
      styleOptions: {
        ...prev.styleOptions,
        advancedEffect: {
          ...prev.styleOptions.advancedEffect,
          [key]: value
        }
      }
    }));
  };

  const handleAnimationChange = (key: keyof TextAnimationOptions, value: any) => {
    setEditorState(prev => ({
      ...prev,
      styleOptions: {
        ...prev.styleOptions,
        animation: {
          ...prev.styleOptions.animation,
          [key]: value
        }
      }
    }));
  };
  
  const handleToggleFilter = (key: 'grayscale' | 'sepia' | 'invert') => {
    setEditorState(prev => ({ 
        ...prev, 
        filters: { 
            ...prev.filters, 
            [key]: prev.filters[key] > 0 ? 0 : 100 
        } 
    }));
  };
  
  const handleGradientChange = (key: keyof GradientOptions, value: string | number) => {
      setEditorState(prev => {
        const newOptions = { ...prev.gradientOptions, [key]: value };
        const { start, end, angle } = newOptions;
        const newBackground = `linear-gradient(${angle}deg, ${start}, ${end})`;
        
        return {
          ...prev,
          gradientOptions: newOptions,
          styleOptions: { ...prev.styleOptions, background: newBackground },
          backgroundImage: null,
        };
      });
  };

  const handleSavePreset = () => {
    const name = window.prompt('Enter a name for your preset:');
    if (!name) return;
    if (customPresets.some(p => p.name === name)) {
      alert('A preset with this name already exists. Please choose a different name.');
      return;
    }
    const { postText, username, ...restOfState } = editorState;
    const newPreset: CustomPreset = { name, state: restOfState };
    const updatedPresets = [...customPresets, newPreset];
    setCustomPresets(updatedPresets);
    localStorage.setItem('customSocialPresets', JSON.stringify(updatedPresets));
  };

  const handleApplyCustomPreset = (preset: CustomPreset) => {
    setEditorState(prev => ({
      ...prev,
      ...preset.state
    }));
  };

  const handleDeletePreset = (nameToDelete: string) => {
    if (!window.confirm(`Are you sure you want to delete the preset "${nameToDelete}"?`)) return;
    const updatedPresets = customPresets.filter(p => p.name !== nameToDelete);
    setCustomPresets(updatedPresets);
    localStorage.setItem('customSocialPresets', JSON.stringify(updatedPresets));
  };
  
  const handleResetBackground = () => {
    setEditorState(prev => ({
      ...prev,
      backgroundImage: null,
      filters: initialFilters,
      styleOptions: {
        ...prev.styleOptions,
        background: BACKGROUND_PRESETS[0].value,
      },
      gradientOptions: {
        start: '#1e3a8a',
        end: '#4f46e5',
        angle: 145,
      }
    }));
    setBackgroundTab('presets');
  };

  const solidColorValue = (typeof styleOptions.background === 'string' && !styleOptions.background.startsWith('linear-gradient')) ? styleOptions.background : '#ffffff';

  return (
    <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Customize Your Post</h2>
        <div className="flex items-center space-x-2">
            <div className="min-w-[110px] text-right mr-2">
                <SaveStatusIndicator status={saveStatus} />
            </div>
            <button
                onClick={undo}
                disabled={!canUndo}
                className="p-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Undo (Ctrl+Z)"
                aria-label="Undo last action"
            >
                <UndoIcon />
            </button>
            <button
                onClick={redo}
                disabled={!canRedo}
                className="p-2 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Redo (Ctrl+Y)"
                aria-label="Redo last action"
            >
                <RedoIcon />
            </button>
        </div>
      </div>
      
      <ControlWrapper title="Quick Start Templates">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TEMPLATES.map((template) => (
            <button
              key={template.name}
              title={`Apply ${template.name} template`}
              onClick={() => {
                setEditorState(prev => ({
                  ...prev,
                  styleOptions: template.styles,
                  backgroundImage: null,
                  contentImage: null,
                  textFillImage: null,
                  filters: initialFilters,
                }));
              }}
              className="p-2 border border-gray-700 bg-gray-900 rounded-lg hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 transition-all text-center group"
              aria-label={`Apply ${template.name} template`}
            >
              <div
                className={`w-full h-16 rounded-md flex items-center justify-center mb-2 overflow-hidden ${template.styles.fontFamily}`}
                style={{
                  background: template.styles.background,
                  color: template.styles.textColor,
                  fontSize: '1rem',
                }}
              >
                Aa
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{template.name}</span>
            </button>
          ))}
        </div>
      </ControlWrapper>
      
      <ControlWrapper title="My Presets">
        <div className="space-y-3 p-4 bg-gray-900/50 rounded-lg">
            {customPresets.length > 0 ? (
            customPresets.map((preset) => (
                <div key={preset.name} className="flex items-center justify-between p-2 bg-gray-700 rounded-md">
                <span className="text-sm font-medium text-gray-300">{preset.name}</span>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleApplyCustomPreset(preset)}
                        className="px-3 py-1 text-xs font-semibold text-cyan-800 bg-cyan-200 rounded-full hover:bg-cyan-300 transition-colors"
                        aria-label={`Apply ${preset.name} preset`}
                    >
                        Apply
                    </button>
                    <button
                        onClick={() => handleDeletePreset(preset.name)}
                        className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-200 rounded-full hover:bg-red-300 transition-colors"
                        aria-label={`Delete ${preset.name} preset`}
                    >
                        Delete
                    </button>
                </div>
                </div>
            ))
            ) : (
            <p className="text-sm text-gray-500 text-center py-2">You have no saved presets.</p>
            )}
            <button
            onClick={handleSavePreset}
            className="w-full mt-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 transition-all"
            >
            Save Current Style as Preset
            </button>
        </div>
      </ControlWrapper>

      <div className="my-8">
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

      <hr className="border-gray-700 my-8" />
      
      <ControlWrapper title="Post Content">
        <textarea
          value={postText}
          onChange={(e) => setEditorState(prev => ({...prev, postText: e.target.value}))}
          rows={5}
          className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
          placeholder="Enter your post text..."
        />
      </ControlWrapper>
      
      <ControlWrapper title="Content Image (Optional)">
          <div className="flex items-center space-x-4">
              <div className="flex-grow">
                  <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleFileChange('contentImage', e)}
                      className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  />
              </div>
              {contentImage && (
                  <button
                      onClick={() => clearImage('contentImage')}
                      className="px-3 py-2 text-xs font-medium text-center text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-800"
                  >
                      Clear
                  </button>
              )}
          </div>
           {contentImage && (
              <div className="space-y-4 p-4 mt-4 bg-gray-700/50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-300">Image Options</h3>
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Image Position</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-800 rounded-lg">
                        <button onClick={() => handleContentImageOptionsChange('position', 'above')} className={`flex justify-center items-center p-2 rounded-md transition-colors ${contentImageOptions.position === 'above' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`} title="Place image above text"> <PositionAboveIcon /> </button>
                        <button onClick={() => handleContentImageOptionsChange('position', 'below')} className={`flex justify-center items-center p-2 rounded-md transition-colors ${contentImageOptions.position === 'below' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`} title="Place image below text"> <PositionBelowIcon /> </button>
                    </div>
                  </div>
                   <div>
                    <label className="block text-xs text-gray-400 mb-2">Image Fit</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-gray-800 rounded-lg">
                        <button onClick={() => handleContentImageOptionsChange('objectFit', 'contain')} className={`flex justify-center items-center p-2 rounded-md transition-colors ${contentImageOptions.objectFit === 'contain' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`} title="Contain image within bounds"> <ObjectContainIcon /> </button>
                        <button onClick={() => handleContentImageOptionsChange('objectFit', 'cover')} className={`flex justify-center items-center p-2 rounded-md transition-colors ${contentImageOptions.objectFit === 'cover' ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`} title="Cover bounds with image (may crop)"> <ObjectCoverIcon /> </button>
                    </div>
                  </div>
                   <div>
                    <label className="block text-xs text-gray-400 mb-2">Rounded Corners</label>
                    <div className="grid grid-cols-4 gap-2 p-1 bg-gray-800 rounded-lg">
                        {(['none', 'lg', '2xl', 'full'] as const).map(r => (
                            <button key={r} onClick={() => handleContentImageOptionsChange('rounded', r)} className={`text-xs py-1.5 rounded-md transition-colors ${contentImageOptions.rounded === r ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>{r}</button>
                        ))}
                    </div>
                  </div>
              </div>
          )}
      </ControlWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <ControlWrapper title="Username">
          <input
            type="text"
            value={username}
            onChange={(e) => setEditorState(prev => ({ ...prev, username: e.target.value }))}
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
            placeholder="@username"
          />
        </ControlWrapper>
        <ControlWrapper title="Profile Picture">
            <input 
                type="file" 
                accept="image/*"
                onChange={(e) => handleFileChange('profilePic', e)}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
        </ControlWrapper>
      </div>
      
      <div className="my-8">
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

      <ControlWrapper title="Background">
        <div className="p-4 bg-gray-700/50 rounded-lg">
            <div className="grid grid-cols-4 gap-1 p-1 bg-gray-800 rounded-lg mb-4">
                {backgroundTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setBackgroundTab(tab.id)}
                        className={`w-full py-1.5 text-xs font-semibold rounded-md transition-colors ${backgroundTab === tab.id ? 'bg-cyan-600 text-white shadow' : 'text-gray-400 hover:bg-gray-700'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="pt-4">
                {backgroundTab === 'presets' && (
                     <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                        {BACKGROUND_PRESETS.map((preset) => (
                            <button
                            key={preset.value}
                            title={preset.label}
                            onClick={() => handleStyleChange('background', preset.value)}
                            className={`w-full aspect-square rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500 ${styleOptions.background === preset.value && !backgroundImage ? 'ring-2 ring-cyan-400' : 'ring-1 ring-gray-600'}`}
                            style={{ background: preset.value }}
                            aria-label={`Set background to ${preset.label}`}
                            />
                        ))}
                    </div>
                )}
                {backgroundTab === 'solid' && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Color</span>
                        <input type="color" value={solidColorValue} onChange={(e) => handleStyleChange('background', e.target.value)} className="w-10 h-10 p-0 bg-transparent border-none cursor-pointer rounded-md" />
                    </div>
                )}
                {backgroundTab === 'gradient' && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                             <span className="text-sm text-gray-400">Start Color</span>
                             <input type="color" value={gradientOptions.start} onChange={(e) => handleGradientChange('start', e.target.value)} className="w-10 h-10 p-0 bg-transparent border-none cursor-pointer rounded-md" />
                        </div>
                         <div className="flex items-center justify-between">
                             <span className="text-sm text-gray-400">End Color</span>
                             <input type="color" value={gradientOptions.end} onChange={(e) => handleGradientChange('end', e.target.value)} className="w-10 h-10 p-0 bg-transparent border-none cursor-pointer rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Angle: {gradientOptions.angle}°</label>
                            <input type="range" min="0" max="360" value={gradientOptions.angle} onChange={(e) => handleGradientChange('angle', parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                        </div>
                    </div>
                )}
                {backgroundTab === 'image' && (
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-grow">
                              <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => handleFileChange('backgroundImage', e)}
                                  className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                              />
                          </div>
                          {backgroundImage && (
                              <button
                                  onClick={() => clearImage('backgroundImage')}
                                  className="px-3 py-2 text-xs font-medium text-center text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-800"
                              >
                                  Clear
                              </button>
                          )}
                        </div>
                        {backgroundImage && (
                          <>
                            <div className="mt-4">
                                <p className="text-xs text-gray-400 mb-2">Preview:</p>
                                <img src={backgroundImage} alt="Background preview" className="w-full h-40 object-cover rounded-lg border border-gray-600" />
                            </div>
                            <div className="space-y-4 pt-4 mt-4 border-t border-gray-600/50">
                              <h3 className="text-sm font-medium text-gray-300">Image Filters</h3>
                              <div className="flex items-center justify-between">
                                  <span className="text-sm text-gray-300">Toggles</span>
                                  <div className="flex items-center space-x-2">
                                      {([ 'grayscale', 'sepia', 'invert' ] as const).map(filter => (
                                           <button key={filter} onClick={() => handleToggleFilter(filter)} className={`px-3 py-1 text-xs rounded-full transition-colors ${filters[filter] > 0 ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>
                                              {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                           </button>
                                      ))}
                                  </div>
                              </div>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Brightness: {filters.brightness}%</label>
                                        <input type="range" min="0" max="200" step="1" value={filters.brightness} onChange={(e) => handleFilterChange('brightness', parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-400 mb-1">Contrast: {filters.contrast}%</label>
                                        <input type="range" min="0" max="200" step="1" value={filters.contrast} onChange={(e) => handleFilterChange('contrast', parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                                    </div>
                               </div>
                               <button onClick={() => setEditorState(prev => ({...prev, filters: initialFilters}))} className="w-full mt-2 px-3 py-2 text-xs font-medium text-center text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-800">
                                    Reset Filters
                               </button>
                            </div>
                          </>
                        )}
                    </div>
                )}
            </div>
        </div>
        <button
          onClick={handleResetBackground}
          className="w-full mt-4 px-3 py-2 text-sm font-medium text-center text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-800"
        >
          Reset to Default Background
        </button>
      </ControlWrapper>

      <ControlWrapper title="Font Family">
        <select value={styleOptions.fontFamily} onChange={(e) => handleStyleChange('fontFamily', e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors">
          {FONT_OPTIONS.map(font => <option key={font.value} value={font.value}>{font.label}</option>)}
        </select>
      </ControlWrapper>

      <ControlWrapper title="Text Style">
        <div className="p-4 bg-gray-700/50 rounded-lg">
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                  <span className={`text-sm text-gray-400 transition-opacity ${textFillImage ? 'opacity-50' : ''}`}>Text Color</span>
                  <input
                      type="color"
                      value={styleOptions.textColor}
                      onChange={(e) => {
                        handleStyleChange('textColor', e.target.value)
                        if (textFillImage) clearImage('textFillImage');
                      }}
                      className="w-10 h-10 p-0 bg-transparent border-none cursor-pointer rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!!textFillImage}
                  />
              </div>
              <hr className="border-gray-600/50" />
              <div>
                  <label className="block text-sm text-gray-300 mb-2">Text Fill Image <span className="text-xs text-gray-400">(Overrides Color)</span></label>
                  <div className="flex items-center space-x-4">
                      <div className="flex-grow">
                          <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange('textFillImage', e)}
                              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                          />
                      </div>
                      {textFillImage && (
                          <button
                              onClick={() => clearImage('textFillImage')}
                              className="px-3 py-2 text-xs font-medium text-center text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-800"
                          >
                              Clear
                          </button>
                      )}
                  </div>
                  {textFillImage && (
                    <div className="mt-4">
                        <p className="text-xs text-gray-400 mb-2">Preview:</p>
                        <img src={textFillImage} alt="Text fill preview" className="w-full h-16 object-cover rounded-md border border-gray-600" />
                    </div>
                  )}
              </div>
          </div>
        </div>
      </ControlWrapper>
      
      <ControlWrapper title="Text Alignment">
        <div className="grid grid-cols-4 gap-2 p-1 bg-gray-700 rounded-lg">
          {alignmentOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStyleChange('textAlign', option.value)}
              className={`flex justify-center items-center p-2 rounded-md transition-colors ${
                styleOptions.textAlign === option.value
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-gray-400 hover:bg-gray-600'
              }`}
              title={option.label}
              aria-label={option.label}
            >
              {option.icon}
            </button>
          ))}
        </div>
      </ControlWrapper>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ControlWrapper title={`Font Size: ${styleOptions.fontSize}px`}>
          <input type="range" min="12" max="48" step="1" value={styleOptions.fontSize} onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
        </ControlWrapper>
        <ControlWrapper title={`Padding: ${styleOptions.padding}px`}>
          <input type="range" min="16" max="96" step="4" value={styleOptions.padding} onChange={(e) => handleStyleChange('padding', parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
        </ControlWrapper>
      </div>

      <div className="my-8">
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
      
      <ControlWrapper title="Text Effects">
        <div className="p-4 bg-gray-700/50 rounded-lg space-y-4">
            <div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Text Shadow</span>
                    <button onClick={() => handleTextEffectChange('textShadow', 'enabled', !styleOptions.textShadow.enabled)} className={`px-3 py-1 text-xs rounded-full transition-colors ${styleOptions.textShadow.enabled ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>
                        {styleOptions.textShadow.enabled ? 'On' : 'Off'}
                    </button>
                </div>
                {styleOptions.textShadow.enabled && (
                    <div className="space-y-4 pt-4 mt-4 border-t border-gray-600/50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Color</span>
                            <input type="color" value={styleOptions.textShadow.color} onChange={(e) => handleTextEffectChange('textShadow', 'color', e.target.value)} className="w-8 h-8 p-0 bg-transparent border-none cursor-pointer rounded-md" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Blur: {styleOptions.textShadow.blur}px</label>
                            <input type="range" min="0" max="20" step="1" value={styleOptions.textShadow.blur} onChange={(e) => handleTextEffectChange('textShadow', 'blur', parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Offset X: {styleOptions.textShadow.offsetX}px</label>
                                <input type="range" min="-10" max="10" step="1" value={styleOptions.textShadow.offsetX} onChange={(e) => handleTextEffectChange('textShadow', 'offsetX', parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Offset Y: {styleOptions.textShadow.offsetY}px</label>
                                <input type="range" min="-10" max="10" step="1" value={styleOptions.textShadow.offsetY} onChange={(e) => handleTextEffectChange('textShadow', 'offsetY', parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                            </div>
                    </div>
                    </div>
                )}
            </div>
            <hr className="border-gray-700/50" />
            <div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Text Outline</span>
                    <button onClick={() => handleTextEffectChange('textOutline', 'enabled', !styleOptions.textOutline.enabled)} className={`px-3 py-1 text-xs rounded-full transition-colors ${styleOptions.textOutline.enabled ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>
                        {styleOptions.textOutline.enabled ? 'On' : 'Off'}
                    </button>
                </div>
                {styleOptions.textOutline.enabled && (
                    <div className="space-y-4 pt-4 mt-4 border-t border-gray-600/50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Color</span>
                            <input type="color" value={styleOptions.textOutline.color} onChange={(e) => handleTextEffectChange('textOutline', 'color', e.target.value)} className="w-8 h-8 p-0 bg-transparent border-none cursor-pointer rounded-md" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Width: {styleOptions.textOutline.width}px</label>
                            <input type="range" min="1" max="5" step="0.5" value={styleOptions.textOutline.width} onChange={(e) => handleTextEffectChange('textOutline', 'width', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                        </div>
                    </div>
                )}
            </div>
            <hr className="border-gray-700/50" />
            <div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Glow</span>
                    <button onClick={() => handleTextEffectChange('glow', 'enabled', !styleOptions.glow.enabled)} className={`px-3 py-1 text-xs rounded-full transition-colors ${styleOptions.glow.enabled ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>
                        {styleOptions.glow.enabled ? 'On' : 'Off'}
                    </button>
                </div>
                {styleOptions.glow.enabled && (
                    <div className="space-y-4 pt-4 mt-4 border-t border-gray-600/50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Color</span>
                            <input type="color" value={styleOptions.glow.color} onChange={(e) => handleTextEffectChange('glow', 'color', e.target.value)} className="w-8 h-8 p-0 bg-transparent border-none cursor-pointer rounded-md" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Blur: {styleOptions.glow.blur}px</label>
                            <input type="range" min="0" max="40" step="1" value={styleOptions.glow.blur} onChange={(e) => handleTextEffectChange('glow', 'blur', parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                        </div>
                    </div>
                )}
            </div>
            <hr className="border-gray-700/50" />
            <div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Neon</span>
                    <button onClick={() => handleTextEffectChange('neon', 'enabled', !styleOptions.neon.enabled)} className={`px-3 py-1 text-xs rounded-full transition-colors ${styleOptions.neon.enabled ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>
                        {styleOptions.neon.enabled ? 'On' : 'Off'}
                    </button>
                </div>
                {styleOptions.neon.enabled && (
                    <div className="space-y-4 pt-4 mt-4 border-t border-gray-600/50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400">Color</span>
                            <input type="color" value={styleOptions.neon.color} onChange={(e) => handleTextEffectChange('neon', 'color', e.target.value)} className="w-8 h-8 p-0 bg-transparent border-none cursor-pointer rounded-md" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Intensity: {styleOptions.neon.blur}px</label>
                            <input type="range" min="5" max="50" step="1" value={styleOptions.neon.blur} onChange={(e) => handleTextEffectChange('neon', 'blur', parseInt(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                        </div>
                    </div>
                )}
            </div>
             <hr className="border-gray-700/50" />
            <div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Advanced Effect</span>
                    <button onClick={() => handleAdvancedEffectChange('enabled', !styleOptions.advancedEffect.enabled)} className={`px-3 py-1 text-xs rounded-full transition-colors ${styleOptions.advancedEffect.enabled ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>
                        {styleOptions.advancedEffect.enabled ? 'On' : 'Off'}
                    </button>
                </div>
                {styleOptions.advancedEffect.enabled && (
                    <div className="space-y-4 pt-4 mt-4 border-t border-gray-600/50">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Effect Type</label>
                            <select value={styleOptions.advancedEffect.type} onChange={(e) => handleAdvancedEffectChange('type', e.target.value)} className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors">
                                <option value="emboss">Emboss</option>
                                <option value="deboss">Deboss</option>
                                <option value="subtleBorder">Subtle Border</option>
                            </select>
                        </div>
                        {(styleOptions.advancedEffect.type === 'emboss' || styleOptions.advancedEffect.type === 'deboss') && (
                            <>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Light Color</span>
                                    <input type="color" value={styleOptions.advancedEffect.lightColor} onChange={(e) => handleAdvancedEffectChange('lightColor', e.target.value)} className="w-8 h-8 p-0 bg-transparent border-none cursor-pointer rounded-md" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Dark Color</span>
                                    <input type="color" value={styleOptions.advancedEffect.darkColor} onChange={(e) => handleAdvancedEffectChange('darkColor', e.target.value)} className="w-8 h-8 p-0 bg-transparent border-none cursor-pointer rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Intensity: {styleOptions.advancedEffect.intensity}px</label>
                                    <input type="range" min="1" max="5" step="0.5" value={styleOptions.advancedEffect.intensity} onChange={(e) => handleAdvancedEffectChange('intensity', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                                </div>
                            </>
                        )}
                        {styleOptions.advancedEffect.type === 'subtleBorder' && (
                             <>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Border Color</span>
                                    <input type="color" value={styleOptions.advancedEffect.borderColor} onChange={(e) => handleAdvancedEffectChange('borderColor', e.target.value)} className="w-8 h-8 p-0 bg-transparent border-none cursor-pointer rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Width: {styleOptions.advancedEffect.intensity}px</label>
                                    <input type="range" min="1" max="5" step="0.5" value={styleOptions.advancedEffect.intensity} onChange={(e) => handleAdvancedEffectChange('intensity', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
      </ControlWrapper>

      <div className="my-8">
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

      <ControlWrapper title="Text Animation">
        <div className="p-4 bg-gray-700/50 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Enable Animation</span>
                <button onClick={() => handleAnimationChange('enabled', !styleOptions.animation.enabled)} className={`px-3 py-1 text-xs rounded-full transition-colors ${styleOptions.animation.enabled ? 'bg-cyan-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'}`}>
                    {styleOptions.animation.enabled ? 'On' : 'Off'}
                </button>
            </div>
            {styleOptions.animation.enabled && (
                <div className="space-y-4 pt-4 mt-4 border-t border-gray-600/50">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Animation Type</label>
                        <select value={styleOptions.animation.type} onChange={(e) => handleAnimationChange('type', e.target.value)} className="w-full p-2 bg-gray-600 border border-gray-500 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors">
                            <option value="fadeIn">Fade In</option>
                            <option value="slideInUp">Slide In Up</option>
                            <option value="slideInLeft">Slide In Left</option>
                            <option value="slideInRight">Slide In Right</option>
                            <option value="zoomIn">Zoom In</option>
                            <option value="bounceIn">Bounce In</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Duration: {styleOptions.animation.duration.toFixed(1)}s</label>
                        <input type="range" min="0.2" max="3" step="0.1" value={styleOptions.animation.duration} onChange={(e) => handleAnimationChange('duration', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Delay: {styleOptions.animation.delay.toFixed(1)}s</label>
                        <input type="range" min="0" max="3" step="0.1" value={styleOptions.animation.delay} onChange={(e) => handleAnimationChange('delay', parseFloat(e.target.value))} className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                    </div>
                </div>
            )}
        </div>
      </ControlWrapper>
      
      <ControlWrapper title="Aspect Ratio">
        <select value={styleOptions.aspectRatio} onChange={(e) => handleStyleChange('aspectRatio', e.target.value)} className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors">
          {ASPECT_RATIO_OPTIONS.map(ratio => <option key={ratio.value} value={ratio.value}>{ratio.label}</option>)}
        </select>
      </ControlWrapper>
    </div>
  );
};

export default Editor;