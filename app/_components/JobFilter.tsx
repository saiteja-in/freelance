'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, ChevronDown, DollarSign, Briefcase, Clock, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const commitmentFilterItems = [
  'FULL_TIME',
  'PART_TIME',
  'INTERNSHIP',
  'FREELANCE',
];

export const experienceFilterItems = [
  '0-1 YOE',
  '1-3 YOE',
  '3-6 YOE',
  '6+ YOE',
];

export const payFilterItems = ['0-10', '10-20', '20-50', '50-100', '100+'];

interface Props {
  handleCommitment: (type: string) => void;
  handleExp: (exp: string) => void;
  handlePay: (pay: string) => void;
  searchQuery: string;
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function JobFilter({
  handleCommitment,
  handleExp,
  handlePay,
  searchQuery,
  handleSearch,
}: Props) {
  const searchParams = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const commitmentTypes = searchParams.getAll('commitment');
  const experienceTypes = searchParams.getAll('exp');
  const payTypes = searchParams.getAll('pay');

  const totalFilterCount = commitmentTypes.length + experienceTypes.length + payTypes.length;

  const FilterContent = () => (
    <div className="flex w-full flex-col space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={handleSearch}
          className="border-zinc-800 bg-zinc-950 pl-10 focus-visible:ring-pink-500"
        />
      </div>
      
      {totalFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {commitmentTypes.map((type) => (
            <Badge 
              key={type} 
              variant="secondary"
              className="flex items-center gap-1 bg-pink-500/20 text-pink-300"
            >
              {type}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleCommitment(type)}
              />
            </Badge>
          ))}
          
          {experienceTypes.map((exp) => (
            <Badge 
              key={exp} 
              variant="secondary"
              className="flex items-center gap-1 bg-pink-500/20 text-pink-300"
            >
              {exp}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handleExp(exp)}
              />
            </Badge>
          ))}
          
          {payTypes.map((pay) => (
            <Badge 
              key={pay} 
              variant="secondary"
              className="flex items-center gap-1 bg-pink-500/20 text-pink-300"
            >
              ${pay}k
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => handlePay(pay)}
              />
            </Badge>
          ))}
        </div>
      )}

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="commitment" className="border-zinc-800">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-pink-500" />
              <span>Commitment Type</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {commitmentFilterItems.map((type) => (
                <div 
                  key={type} 
                  className={`flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm transition-all ${
                    commitmentTypes.includes(type) 
                      ? 'border-pink-500 bg-pink-500/10 text-pink-300' 
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                  onClick={() => handleCommitment(type)}
                >
                  <div className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                    commitmentTypes.includes(type) 
                      ? 'border-pink-500 bg-pink-500 text-white' 
                      : 'border-zinc-600'
                  }`}>
                    {commitmentTypes.includes(type) && <Check className="h-3 w-3" />}
                  </div>
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="experience" className="border-zinc-800">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-pink-500" />
              <span>Experience Level</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {experienceFilterItems.map((yoe) => (
                <div 
                  key={yoe} 
                  className={`flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm transition-all ${
                    experienceTypes.includes(yoe) 
                      ? 'border-pink-500 bg-pink-500/10 text-pink-300' 
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                  onClick={() => handleExp(yoe)}
                >
                  <div className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                    experienceTypes.includes(yoe) 
                      ? 'border-pink-500 bg-pink-500 text-white' 
                      : 'border-zinc-600'
                  }`}>
                    {experienceTypes.includes(yoe) && <Check className="h-3 w-3" />}
                  </div>
                  <span>{yoe}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="pay" className="border-zinc-800">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-pink-500" />
              <span>Salary Range</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {payFilterItems.map((pay) => (
                <div 
                  key={pay} 
                  className={`flex cursor-pointer items-center gap-2 rounded-md border p-2 text-sm transition-all ${
                    payTypes.includes(pay) 
                      ? 'border-pink-500 bg-pink-500/10 text-pink-300' 
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700'
                  }`}
                  onClick={() => handlePay(pay)}
                >
                  <div className={`flex h-4 w-4 items-center justify-center rounded-sm border ${
                    payTypes.includes(pay) 
                      ? 'border-pink-500 bg-pink-500 text-white' 
                      : 'border-zinc-600'
                  }`}>
                    {payTypes.includes(pay) && <Check className="h-3 w-3" />}
                  </div>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {pay}k
                  </span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden h-full md:block md:w-1/4 md:min-w-64">
        <div className="sticky top-24 h-[calc(100vh-120px)] overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Filters</h2>
            {totalFilterCount > 0 && (
              <Button 
                variant="link" 
                className="h-auto p-0 text-xs text-pink-400"
                onClick={() => {
                  // Logic to clear all filters
                  commitmentTypes.forEach(type => handleCommitment(type));
                  experienceTypes.forEach(exp => handleExp(exp));
                  payTypes.forEach(pay => handlePay(pay));
                }}
              >
                Clear all
              </Button>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Button */}
      <div className="fixed bottom-6 left-0 z-40 flex w-full justify-center md:hidden">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 rounded-full bg-pink-500 px-4 py-2 text-sm font-medium text-white shadow-lg"
        >
          Filters
          {totalFilterCount > 0 && (
            <Badge className="bg-white text-pink-500">{totalFilterCount}</Badge>
          )}
        </motion.button>
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsMobileFilterOpen(false)}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-auto rounded-t-xl bg-zinc-950 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between pb-2">
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 rounded-full p-0"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <FilterContent />
            <div className="mt-6 flex w-full justify-center">
              <Button 
                className="w-full bg-pink-500 text-white hover:bg-pink-600"
                onClick={() => setIsMobileFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

// Missing icon component
function Check(props:any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}