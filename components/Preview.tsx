import React, { forwardRef, useState } from 'react';
import type { EditorState } from '../types';
import { UserCircleIcon, ReplayIcon } from './icons';

interface PreviewProps {
  editorState: EditorState;
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(({ editorState }, ref) => {
  const { 
    postText, 
    username, 
    profilePic, 
    styleOptions, 
    backgroundImage, 
    contentImage, 
    textFillImage, 
    filters,
    contentImageOptions,
  } = editorState;

  const [replayCount, setReplayCount] = useState(0); // For manually replaying animation

  const containerStyle: React.CSSProperties = {
    padding: `${styleOptions.padding}px`,
  };

  const backgroundStyle: React.CSSProperties = {};

  if (backgroundImage) {
    backgroundStyle.backgroundImage = `url(${backgroundImage})`;
    backgroundStyle.backgroundSize = 'cover';
    backgroundStyle.backgroundPosition = 'center';
    backgroundStyle.backgroundRepeat = 'no-repeat';
    backgroundStyle.filter = `
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      invert(${filters.invert}%)
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
    `.replace(/\s+/g, ' ');
  } else {
    containerStyle.background = styleOptions.background;
  }

  const textStyle: React.CSSProperties = {
    color: styleOptions.textColor,
    fontSize: `${styleOptions.fontSize}px`,
    lineHeight: 1.6,
  };

  if (textFillImage) {
      textStyle.backgroundImage = `url(${textFillImage})`;
      textStyle.backgroundSize = 'cover';
      textStyle.backgroundPosition = 'center';
      // @ts-ignore - vendor prefix for this feature
      textStyle.WebkitBackgroundClip = 'text';
      textStyle.backgroundClip = 'text';
      textStyle.color = 'transparent';
  }

  const textShadows: string[] = [];

  if (styleOptions.textShadow.enabled) {
    const { offsetX, offsetY, blur, color } = styleOptions.textShadow;
    textShadows.push(`${offsetX}px ${offsetY}px ${blur}px ${color}`);
  }
  
  if (styleOptions.glow.enabled) {
      const { blur, color } = styleOptions.glow;
      textShadows.push(`0 0 ${blur}px ${color}`);
  }
  
  if (styleOptions.neon.enabled) {
      const { blur, color } = styleOptions.neon;
      textShadows.push(`0 0 ${blur * 0.2}px #fff`);
      textShadows.push(`0 0 ${blur * 0.4}px #fff`);
      textShadows.push(`0 0 ${blur * 0.6}px ${color}`);
      textShadows.push(`0 0 ${blur * 1}px ${color}`);
  }

  if (styleOptions.advancedEffect.enabled) {
    const { type, lightColor, darkColor, intensity, borderColor } = styleOptions.advancedEffect;
    const offset = `${intensity}px`;

    switch (type) {
        case 'emboss':
            textShadows.push(`-${offset} -${offset} ${offset} ${lightColor}`);
            textShadows.push(`${offset} ${offset} ${offset} ${darkColor}`);
            break;
        case 'deboss':
            textShadows.push(`${offset} ${offset} ${offset} ${lightColor}`);
            textShadows.push(`-${offset} -${offset} ${offset} ${darkColor}`);
            break;
        case 'subtleBorder':
            const width = `${intensity}px`;
            const color = borderColor;
            textShadows.push(`-${width} -${width} 0 ${color}`);
            textShadows.push(`${width} -${width} 0 ${color}`);
            textShadows.push(`-${width} ${width} 0 ${color}`);
            textShadows.push(`${width} ${width} 0 ${color}`);
            break;
    }
  }

  if (textShadows.length > 0) {
    textStyle.textShadow = textShadows.join(', ');
  }

  if (styleOptions.textOutline.enabled) {
    const { width, color } = styleOptions.textOutline;
    // @ts-ignore - vendor prefix for this feature
    textStyle.WebkitTextStroke = `${width}px ${color}`;
  }

  const textAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  }[styleOptions.textAlign];

  const { animation } = styleOptions;
  // Combine animation settings with replay count to create a unique key
  const animationKey = `${JSON.stringify(animation)}-${replayCount}`;

  const handleReplayAnimation = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent handlers from firing
    setReplayCount(prev => prev + 1);
  };

  const animatedTextStyle = { ...textStyle };
  if (animation.enabled) {
      animatedTextStyle.animationName = animation.type;
      animatedTextStyle.animationDuration = `${animation.duration}s`;
      animatedTextStyle.animationDelay = `${animation.delay}s`;
      animatedTextStyle.animationFillMode = 'both'; // Applies styles before/after animation
  }

  const textBlock = (
    <div
      key={animationKey}
      className={`whitespace-pre-wrap break-words ${styleOptions.fontFamily} ${textAlignClass}`}
      style={animatedTextStyle}
    >
      {postText}
    </div>
  );

  const { position, objectFit, rounded } = contentImageOptions;
  const roundedClass = {
      none: 'rounded-none',
      lg: 'rounded-lg',
      '2xl': 'rounded-2xl',
      full: 'rounded-full'
  }[rounded];
  const objectFitClass = objectFit === 'contain' ? 'object-contain' : 'object-cover';
  const imageContainerHeightClass = objectFit === 'cover' ? 'h-80' : '';
  const imageSizeClass = objectFit === 'cover' ? 'h-full' : 'h-auto max-h-80';

  const imageBlock = contentImage && (
    <div className={`overflow-hidden flex-shrink-0 border border-white/10 ${roundedClass} ${imageContainerHeightClass}`}>
        <img 
          src={contentImage} 
          alt="Post content" 
          className={`w-full ${objectFitClass} ${imageSizeClass}`}
        />
    </div>
  );

  return (
    <div
      ref={ref}
      className={`group w-full overflow-hidden flex flex-col justify-center items-center relative ${styleOptions.aspectRatio}`}
      style={containerStyle}
    >
        {backgroundImage && (
            <div
                className="absolute inset-0 w-full h-full"
                style={backgroundStyle}
            />
        )}
        {animation.enabled && (
             <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={handleReplayAnimation}
                    className="p-4 bg-gray-800/70 rounded-full text-white hover:bg-cyan-500/80 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    title="Replay Animation"
                    aria-label="Replay text animation"
                >
                    <ReplayIcon />
                </button>
            </div>
        )}
        <div className="w-full h-full flex flex-col relative z-10">
            <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4 bg-white/20 flex-shrink-0">
                    {profilePic ? (
                        <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <UserCircleIcon />
                    )}
                </div>
                <p style={{ color: textFillImage ? 'inherit' : styleOptions.textColor }} className="font-bold text-lg">
                    {username}
                </p>
            </div>
            <div className="flex-grow flex flex-col min-h-0">
                {position === 'above' && imageBlock && <div className="mb-4">{imageBlock}</div>}
                {textBlock}
                {position === 'below' && imageBlock && <div className="mt-4">{imageBlock}</div>}
            </div>
        </div>
    </div>
  );
});

Preview.displayName = 'Preview';
export default Preview;
