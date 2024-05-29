import _ from 'lodash';

const makeStylishDiff = (obj1, obj2, depth = 1) => {
  const formatValue1 = (value, depth1) => {
    if (_.isObject(value)) {
      return makeStylishDiff(value, value, depth1 + 1);
    }
    return value;
  };
  const keys = _.union(Object.keys(obj1), Object.keys(obj2)).toSorted();

  const diffLines = keys.map((key) => {
    const currentDepth = '  '.repeat(depth);
    const indentation = '  '.repeat(depth + 1);
    if (!_.has(obj1, key)) {
      return `${currentDepth}+ ${key}: ${formatValue1(obj2[key], depth + 1, indentation)}`;
    }
    if (!_.has(obj2, key)) {
      return `${currentDepth}- ${key}: ${formatValue1(obj1[key], depth + 1, indentation)}`;
    }
    if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
      return `${currentDepth}  ${key}: ${makeStylishDiff(obj1[key], obj2[key], depth + 2)}`;
    }
    if (obj1[key] === obj2[key]) {
      return `${currentDepth}  ${key}: ${formatValue1(obj1[key], depth + 1, indentation)}`;
    }
    return `${currentDepth}- ${key}: ${formatValue1(obj1[key], depth + 1, indentation)}\n${currentDepth}+ ${key}: ${formatValue1(obj2[key], depth + 1, indentation)}`;
  });

  return `{\n${diffLines.join('\n')}\n${'  '.repeat(depth - 1)}}`;
};

const makePlainDiff = (obj11, obj22) => {
  const formatValue = (value) => {
    if (_.isObject(value)) {
      return '[complex value]';
    }
    if (typeof value === 'string') return `'${value}'`;
    return value;
  };

  const traverseObject = (obj1, obj2, prefix = '') => {
    const diffOutput = Object.keys(obj1).reduce((acc, key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
        return acc.concat(`Property '${fullKey}' was removed`);
      } if (_.isEqual(obj1[key], obj2[key])) {
        return acc;
      } if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
        return traverseObject(obj1[key], obj2[key], fullKey).concat(acc);
      }
      return acc.concat(`Property '${fullKey}' was updated. From ${formatValue(obj1[key])} to ${formatValue(obj2[key])}`);
    }, []);

    const newKeys = Object.keys(obj2).filter((key) => !Object.prototype
      .hasOwnProperty.call(obj1, key));
    const newDiffOutput = newKeys.map((key) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      return `Property '${fullKey}' was added with value: ${formatValue(obj2[key])}`;
    });

    return diffOutput.concat(newDiffOutput).toSorted();
  };

  return traverseObject(obj11, obj22).join('\n');
};

const formatter = (data1, data2, format) => {
  switch (format) {
    case 'stylish':
      return makeStylishDiff(data1, data2);
    case 'plain':
      return makePlainDiff(data1, data2);
    case 'json':
      return JSON.stringify(data1, data2, null);
    default:
      throw new Error('invalid data');
  }
};

export default formatter;
