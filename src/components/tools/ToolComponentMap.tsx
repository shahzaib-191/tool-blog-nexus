import React from 'react';
import * as LucideIcons from 'lucide-react';

// Import tool components
const ImageToPdfTool = React.lazy(() => import('./ImageToPdfTool'));
const TextToSpeechTool = React.lazy(() => import('./TextToSpeechTool'));
const PDFToWordTool = React.lazy(() => import('./PDFToWordTool'));
const QRCodeTool = React.lazy(() => import('./QRCodeTool'));
const WordCounterTool = React.lazy(() => import('./WordCounterTool'));
const MetaTagGeneratorTool = React.lazy(() => import('./MetaTagGeneratorTool'));
const PlagiarismCheckerTool = React.lazy(() => import('./PlagiarismCheckerTool'));
const AIBlogIdeaGeneratorTool = React.lazy(() => import('./AIBlogIdeaGeneratorTool'));
const BMICalculatorTool = React.lazy(() => import('./BMICalculatorTool'));
const AgeCalculatorTool = React.lazy(() => import('./AgeCalculatorTool'));
const KeywordResearchTool = React.lazy(() => import('./KeywordResearchTool'));
const ImageCompressorTool = React.lazy(() => import('./ImageCompressorTool'));
const ImageResizerTool = React.lazy(() => import('./ImageResizerTool'));
const BackgroundRemoverTool = React.lazy(() => import('./BackgroundRemoverTool'));
const VideoToGifTool = React.lazy(() => import('./VideoToGifTool'));
const JsonFormatterTool = React.lazy(() => import('./JsonFormatterTool'));
const AITextGeneratorTool = React.lazy(() => import('./AITextGeneratorTool'));
const AIParaphraserTool = React.lazy(() => import('./AIParaphraserTool'));
const PasswordGeneratorTool = React.lazy(() => import('./PasswordGeneratorTool'));
const CodeMinifierTool = React.lazy(() => import('./CodeMinifierTool'));
const LoremIpsumGeneratorTool = React.lazy(() => import('./LoremIpsumGeneratorTool'));
const SpeechToTextTool = React.lazy(() => import('./SpeechToTextTool'));
const OnlineNotepadTool = React.lazy(() => import('./OnlineNotepadTool'));

// Default placeholder for tools that haven't been implemented yet
const DefaultToolPlaceholder: React.FC = () => (
  <div className="text-center py-8">
    <p className="mb-4">This tool interface is under development.</p>
    <p className="text-gray-600">Please check back later for full functionality.</p>
  </div>
);

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
  'unit-converter': UnitConverterTool,
  'currency-converter': CurrencyConverterTool,
  'pomodoro-timer': PomodoroTimerTool,
  'world-clock': WorldClockTool,
  'audio-to-text': AudioToTextTool,
  'backlink-checker': BacklinkCheckerTool,
  'website-speed-test': WebsiteSpeedTestTool,
  'utm-link-builder': UTMLinkBuilderTool,
  'readability-checker': ReadabilityCheckerTool,
  'domain-age-checker': DomainAgeCheckerTool,
  'ssl-checker': SSLCheckerTool,
  'whois-lookup': WhoisLookupTool,
  'dns-lookup': DNSLookupTool,
  'port-scanner': PortScannerTool
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

export default toolComponents;
