import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

interface TimeRange {
  startDateTime?: Date; // 开始日期时间
  endDateTime?: Date; // 结束日期时间
}

interface TimeRangePickerProps {
  className?: string;
  timeRange: TimeRange;
  onTimeRangeChange: (timeRange: TimeRange) => void;
}

export function TimeRangePicker({
  className,
  timeRange,
  onTimeRangeChange,
}: TimeRangePickerProps) {
  // 生成小时和分钟选项
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutesDelta = 10;
  const minutes = Array.from(
    { length: 60 / minutesDelta },
    (_, i) => i * minutesDelta
  );

  const [date, setDate] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const formatTimeDisplay = (date: DateRange) => {
    
    if (!date?.from || !date?.to) return " 选择时间范围";
    return `${format(date.from, "yyyy-MM-dd HH:mm")} 至 ${format(date.to, "yyyy-MM-dd HH:mm")}`;
  };

  // 更新日期时间的辅助函数
  const updateDateTime = (isStartDate: boolean, isHour: boolean, value: string) => {
    if (!date) return;

    const targetDate = isStartDate ? date.from : date.to;
    if (!targetDate) {
      const newDate = new Date();
      setDate({
        ...date,
        [isStartDate ? 'from' : 'to']: newDate
      });
      return;
    }

    const newDate = new Date(targetDate);
    if (isHour) {
      newDate.setHours(parseInt(value));
    } else {
      newDate.setMinutes(parseInt(value));
    }

    setDate({
      ...date,
      [isStartDate ? 'from' : 'to']: newDate
    });


    if (!date.from || !date.to) {
      onTimeRangeChange({
        startDateTime: undefined,
        endDateTime: undefined,
      });
      return;
    }
    onTimeRangeChange({
      startDateTime: date.from,
      endDateTime: date.to,
    });
  };

  // 获取默认分钟值
  const getDefaultMinutes = (targetDate?: Date) => {
    if (!targetDate) return "0";
    return (Math.floor(targetDate.getMinutes() / minutesDelta + 0.5) * minutesDelta).toString();
  };

  // 创建时间选择器组件
  const TimeSelector = ({ isStartDate }: { isStartDate: boolean }) => (
    <div className="flex flex-row gap-2 w-1/2">
      <Select
        onValueChange={(value) => updateDateTime(isStartDate, true, value)}
        defaultValue={(isStartDate ? date.from?.getHours() : date.to?.getHours())?.toString()}
      >
        <SelectTrigger>
          <SelectValue placeholder="选择小时" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((hour) => (
            <SelectItem key={hour} value={hour.toString()}>
              {hour.toString().padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => updateDateTime(isStartDate, false, value)}
        defaultValue={getDefaultMinutes(isStartDate ? date.from : date.to)}
      >
        <SelectTrigger>
          <SelectValue placeholder="选择分钟" />
        </SelectTrigger>
        <SelectContent>
          {minutes.map((minute) => (
            <SelectItem key={minute} value={minute.toString()}>
              {minute.toString().padStart(2, "0")}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className={cn("flex gap-2 hover:text-black text-gray-800", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="start-time"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !timeRange.startDateTime && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatTimeDisplay(date)}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto select-none" align="start">
          <div className="flex flex-col gap-2">
            <Calendar
              initialFocus
              mode="range"
              selected={date}
              onSelect={(value) => {
                if (!value) return;
                setDate(value);

                if (!value.from || !value.to) {
                  onTimeRangeChange({
                    startDateTime: undefined,
                    endDateTime: undefined,
                  });
                  return;
                }
                onTimeRangeChange({
                  startDateTime: value.from,
                  endDateTime: value.to,
                });
              }}
              numberOfMonths={2}
            />
            <div className="flex flex-row gap-2">
              <TimeSelector isStartDate={true} />
              <TimeSelector isStartDate={false} />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}