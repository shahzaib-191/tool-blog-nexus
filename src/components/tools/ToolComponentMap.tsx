
import React from 'react';
import { Tool } from '@/services/toolsService';
import * as LucideIcons from 'lucide-react';

// Import tool components
import ImageToPdfTool from './ImageToPdfTool';
import TextToSpeechTool from './TextToSpeechTool';
import PDFToWordTool from './PDFToWordTool';
import QRCodeTool from './QRCodeTool';
import WordCounterTool from './WordCounterTool';
import MetaTagGeneratorTool from './MetaTagGeneratorTool';
import PlagiarismCheckerTool from './PlagiarismCheckerTool';
import AIBlogIdeaGeneratorTool from './AIBlogIdeaGeneratorTool';
import BMICalculatorTool from './BMICalculatorTool';
import AgeCalculatorTool from './AgeCalculatorTool';
import KeywordResearchTool from './KeywordResearchTool';
import ImageCompressorTool from './ImageCompressorTool';
import ImageResizerTool from './ImageResizerTool';
import BackgroundRemoverTool from './BackgroundRemoverTool';
import VideoToGifTool from './VideoToGifTool';
import JsonFormatterTool from './JsonFormatterTool';
import AITextGeneratorTool from './AITextGeneratorTool';
import AIParaphraserTool from './AIParaphraserTool';
import PasswordGeneratorTool from './PasswordGeneratorTool';
import CodeMinifierTool from './CodeMinifierTool';
import LoremIpsumGeneratorTool from './LoremIpsumGeneratorTool';
import SpeechToTextTool from './SpeechToTextTool';
import OnlineNotepadTool from './OnlineNotepadTool';

// Map tool IDs to their component implementations
const toolComponents: Record<string, React.FC> = {
  'pdf-to-word': PDFToWordTool,
  'word-to-pdf': PDFToWordTool, // Reusing the same component
  'image-to-pdf': ImageToPdfTool,
  'qr-generator': QRCodeTool,
  'word-counter': WordCounterTool,
  'text-to-speech': TextToSpeechTool,
  'speech-to-text': SpeechToTextTool,
  'online-notepad': OnlineNotepadTool,
  'meta-tag-generator': MetaTagGeneratorTool,
  'plagiarism-checker': PlagiarismCheckerTool,
  'ai-blog-idea': AIBlogIdeaGeneratorTool,
  'bmi-calculator': BMICalculatorTool,
  'age-calculator': AgeCalculatorTool,
  'keyword-research': KeywordResearchTool,
  'image-compressor': ImageCompressorTool,
  'image-resizer': ImageResizerTool,
  'background-remover': BackgroundRemoverTool,
  'video-to-gif': VideoToGifTool,
  'json-formatter': JsonFormatterTool,
  'ai-text-generator': AITextGeneratorTool,
  'ai-paraphraser': AIParaphraserTool,
  'password-generator': PasswordGeneratorTool,
  'css-minifier': CodeMinifierTool,
  'lorem-ipsum': LoremIpsumGeneratorTool,
  // Add more tool implementations as needed
};

export const getToolComponent = (toolId: string | undefined): React.FC => {
  if (!toolId || !toolComponents[toolId]) {
    return DefaultToolPlaceholder;
  }
  
  return toolComponents[toolId];
};

export const getIconComponent = (iconName?: string) => {
  return iconName 
    ? (LucideIcons as any)[iconName] || LucideIcons.Wrench 
    : LucideIcons.Wrench;
};

// Default placeholder for tools that haven't been implemented yet
const DefaultToolPlaceholder: React.FC = () => (
  <div className="text-center py-8">
    <p className="mb-4">This tool interface is under development.</p>
    <p className="text-gray-600">Please check back later for full functionality.</p>
  </div>
);

export default toolComponents;
