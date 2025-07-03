/**
 * @fileoverview Visualization template selector component
 * @module components/visualization-template-selector
 */

'use client';

import { Card } from '@/components/ui/card';
import { 
  VisualizationTemplate, 
  VisualizationConfig,
  VISUALIZATION_TEMPLATES 
} from '@/lib/types/visualization';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  TrendingUp, 
  GitCompare,
  Check
} from 'lucide-react';

interface VisualizationTemplateSelectorProps {
  selectedTemplate: VisualizationTemplate;
  onTemplateChange: (template: VisualizationTemplate, config: Partial<VisualizationConfig>) => void;
  disabled?: boolean;
}

const templateIcons: Record<VisualizationTemplate, React.ReactNode> = {
  'performance-overview': <BarChart3 className="h-5 w-5" />,
  'improvement-focus': <TrendingUp className="h-5 w-5" />,
  'comparative-analysis': <GitCompare className="h-5 w-5" />,
};

export function VisualizationTemplateSelector({
  selectedTemplate,
  onTemplateChange,
  disabled = false,
}: VisualizationTemplateSelectorProps) {
  const handleTemplateSelect = (templateId: VisualizationTemplate) => {
    const template = VISUALIZATION_TEMPLATES[templateId];
    onTemplateChange(templateId, template.defaultConfig);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Visualization Template</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Choose a template that best fits your communication needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(VISUALIZATION_TEMPLATES).map(([id, template]) => {
          const isSelected = selectedTemplate === id;
          
          return (
            <Card
              key={id}
              className={cn(
                'p-4 cursor-pointer transition-all hover:shadow-md',
                isSelected && 'ring-2 ring-nextgen-green',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
              onClick={() => !disabled && handleTemplateSelect(id as VisualizationTemplate)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {templateIcons[id as VisualizationTemplate]}
                    <h4 className="font-medium">{template.name}</h4>
                  </div>
                  {isSelected && (
                    <div className="rounded-full bg-nextgen-green p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
                
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-600">Features:</p>
                  <ul className="text-xs text-gray-500 space-y-0.5">
                    {template.features.showCurrentPerformance && (
                      <li>• Current performance</li>
                    )}
                    {template.features.showProjections && (
                      <li>• Improvement projections</li>
                    )}
                    {template.features.showPeerComparison && (
                      <li>• Peer comparison</li>
                    )}
                    {template.features.showGradeTargets && (
                      <li>• Grade level targets</li>
                    )}
                    {template.features.emphasizeImprovement && (
                      <li>• <strong>Emphasizes growth potential</strong></li>
                    )}
                    {template.features.comparePackages && (
                      <li>• <strong>Side-by-side comparison</strong></li>
                    )}
                  </ul>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Template Preview */}
      <Card className="p-4 bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-nextgen-green animate-pulse" />
          <p className="text-sm font-medium">Template Applied</p>
        </div>
        <p className="text-sm text-muted-foreground">
          The selected template will automatically configure the visualization settings 
          for optimal presentation of {VISUALIZATION_TEMPLATES[selectedTemplate].name.toLowerCase()}.
        </p>
      </Card>
    </div>
  );
} 