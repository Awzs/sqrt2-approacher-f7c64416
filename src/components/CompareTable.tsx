import React from 'react';
import { generateComparisonTable } from '../logic/steps';
import { ApproximationStep } from '../logic/steps';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface CompareTableProps {
  steps: ApproximationStep[];
  currentStep: number;
  isVisible: boolean;
  onClose: () => void;
  className?: string;
}

export const CompareTable: React.FC<CompareTableProps> = ({
  steps,
  currentStep,
  isVisible,
  onClose,
  className = ''
}) => {
  if (!isVisible) return null;
  
  const tableData = generateComparisonTable(steps, currentStep);
  
  return (
    <Card className={`${className} transition-smooth`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            数值比较表
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            aria-label="关闭表格"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-3 font-medium">近似值 (a)</th>
                <th className="text-left py-2 px-3 font-medium">平方值 (a²)</th>
                <th className="text-left py-2 px-3 font-medium">与 2 的关系</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => (
                <tr 
                  key={index}
                  className={`border-b last:border-b-0 transition-colors ${
                    row.isHighlight 
                      ? 'bg-primary/10 border-primary/20' 
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <td className={`py-2 px-3 math-mono ${
                    row.isHighlight ? 'font-semibold text-primary' : ''
                  }`}>
                    {row.value}
                  </td>
                  <td className={`py-2 px-3 math-mono ${
                    row.isHighlight ? 'font-semibold text-primary' : ''
                  }`}>
                    {row.square}
                  </td>
                  <td className={`py-2 px-3 ${
                    row.isHighlight ? 'font-semibold' : ''
                  }`}>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                      row.comparison === '< 2' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : row.comparison === '> 2'
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {row.comparison}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Summary */}
        <div className="mt-4 p-3 bg-muted rounded-md text-xs text-muted-foreground">
          <p>
            <strong>说明:</strong> 表格显示了到当前步骤为止所有测试过的数值。
            蓝色表示平方值小于2，橙色表示大于2，绿色表示等于2（理论上）。
          </p>
        </div>
      </CardContent>
    </Card>
  );
};