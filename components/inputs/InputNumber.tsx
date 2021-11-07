import { ChangeEvent, VFC } from 'react';

interface IProps {
  type: string;
  value: number;
  onChangeValue: (e: ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
}

const InputNumber: VFC<IProps> = ({
  type, value, onChangeValue, min, max,
}) => (
  <>
    <div className="ml-3 text-gray-700 font-medium">
      {type}
    </div>
    <input
      className="px-6 py-2 w-24 rounded-full bg-gray-100 text-xl outline-none"
      type="number"
      min={min}
      max={max}
      value={value}
      onChange={onChangeValue}
    />
  </>
);

export default InputNumber;
