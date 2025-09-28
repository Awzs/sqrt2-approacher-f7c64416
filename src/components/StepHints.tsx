import React from 'react';
import { ApproximationStep } from '../logic/steps';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface StepHintsProps {
  steps: ApproximationStep[];
  currentStep: number;
  className?: string;
}

export const StepHints: React.FC<StepHintsProps> = ({
  steps,
  currentStep,
  className = ''
}) => {
  if (currentStep >= steps.length) return null;
  
  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  
  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            步骤说明
          </CardTitle>
          <Badge variant="secondary">
            第 {currentStep + 1} 步
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main description */}
        <div className="p-3 bg-muted rounded-md">
          <p className="text-sm leading-relaxed">
            {step.description}
          </p>
        </div>
        
        {/* Mathematical expressions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="math-expression bg-blue-50 dark:bg-blue-950/20">
            <div className="text-center">
              <div className="math-result text-primary">
                {step.lowerExpression.value}² = {step.lowerExpression.square}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {step.lowerExpression.comparison}
              </div>
            </div>
          </div>
          
          <div className="math-expression bg-orange-50 dark:bg-orange-950/20">
            <div className="text-center">
              <div className="math-result text-primary">
                {step.upperExpression.value}² = {step.upperExpression.square}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {step.upperExpression.comparison}
              </div>
            </div>
          </div>
        </div>
        
        {/* Educational notes */}
        <div className="text-xs text-muted-foreground border-t pt-3 space-y-2">
          {isFirstStep && (
            <p>
              💡 <strong>关键思路:</strong> 比较平方大小：若 a² ＜ 2，则 √2 在 a 的右侧；若 a² ＞ 2，则在左侧。
            </p>
          )}
          
          {!isFirstStep && !isLastStep && (
            <p>
              🔍 <strong>区间缩小:</strong> 通过不断比较平方值，我们将包含 √2 的区间逐步缩小。
            </p>
          )}
          
          {isLastStep && (
            <div className="space-y-1">
              <p>
                ✨ <strong>无限逼近:</strong> √2 是无理数，无法用分数 p/q（p、q 为整数）准确表示。
              </p>
              <p>
                📐 <strong>实际应用:</strong> 但我们可以用小数位数不断增加来逼近它的真实值。
              </p>
            </div>
          )}
        </div>
        
        {/* Current interval info */}
        <div className="flex items-center justify-between text-sm bg-accent/50 p-2 rounded">
          <span className="text-muted-foreground">当前区间:</span>
          <span className="math-mono font-semibold">
            [{step.lowerExpression.value}, {step.upperExpression.value}]
          </span>
          <span className="text-muted-foreground">
            宽度: {(step.upper - step.lower).toFixed(step.precision + 1)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};