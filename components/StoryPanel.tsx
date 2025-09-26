import React from 'react';
import CodeBlock from './CodeBlock';

interface StoryPanelProps {
  title: string;
  story: string;
  explanation: string;
  example: string;
  challenge: string;
  onRefreshExample: () => void;
  isRefreshingExample: boolean;
}

const Section: React.FC<{ title: string; children: React.ReactNode; titleAction?: React.ReactNode, id?: string }> = ({ title, children, titleAction, id }) => (
  <div className="mb-5" id={id}>
    <div className="flex justify-between items-center border-b border-gray-600 pb-1 mb-2">
      <h3 className="text-lg font-semibold text-orange-300">{title}</h3>
      {titleAction}
    </div>
    <div className="text-gray-300 space-y-2">
      {children}
    </div>
  </div>
);

// SVG Icons for the refresh button
const IconRefresh: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M20 4h-5v5M4 20h5v-5M12 4c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8z" /></svg>;
const IconSpinnerSmall: React.FC = () => <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;


const StoryPanel: React.FC<StoryPanelProps> = ({ title, story, explanation, example, challenge, onRefreshExample, isRefreshingExample }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700 flex flex-col max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      
      <Section title="Your Mission" id="mission">
        <p className="italic">{story}</p>
      </Section>
      
      <Section title="The Guru's Teaching" id="teaching">
        <p>{explanation}</p>
      </Section>

      <Section 
        id="example"
        title="An Example from the Guru"
        titleAction={
          <button 
            onClick={onRefreshExample} 
            disabled={isRefreshingExample}
            className="flex items-center gap-1.5 text-xs text-blue-300 hover:text-blue-200 disabled:text-gray-400 disabled:cursor-wait transition-colors"
            aria-label="Get new example"
          >
            {isRefreshingExample ? <IconSpinnerSmall /> : <IconRefresh />}
            {isRefreshingExample ? 'Consulting...' : 'New Example'}
          </button>
        }
      >
        <CodeBlock code={example} />
      </Section>

      <Section title="Your Test" id="test">
        <p className="font-semibold">{challenge}</p>
      </Section>
    </div>
  );
};

export default StoryPanel;