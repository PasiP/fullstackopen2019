interface ResultValues {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
}

interface ArgumentValues {
  target: number;
  hours: Array<number>;
}

const ratings = ['pretty bad',
                'not too bad but could be better',
                'good'];

const parseArguments = (args: Array<string>): ArgumentValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  if (!isNaN(Number(args[2]))) {
    if (Number(args[2]) < 1 || Number(args[2]) > 3) throw new Error('First argument must be a number between 1 and 3');
    const target = Number(args[2]);
    args.splice(0,3);
    const hours = args;

    return {
      target: target,
      hours: parseHours(hours)
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

const parseHours = (hours: Array<string>): Array<number> => {
  return hours.reduce( (hours: Array<number>, hour: string) => {
    if(isNaN(Number(hour))) throw new Error('Provided values were not numbers!');
    if(Number(hour) < 0 || Number(hour) > 24) throw new Error('Given value must be between 0 and 24');

    hours.push(Number(hour));
    return hours;
  }, []);
};

const calculateExercises = (hours: Array<number>, target: number): ResultValues => {

  const countAverage = ( arr: Array<number>): number => {
    const sum = arr.reduce((sum, current) => sum + current);
    const average = sum / arr.length;
    return average;
  };

  const countRating = ( arr: Array<number>): number => {
    const sum = arr.reduce((sum, current) => sum + current);

    switch(true) {
      case (sum < 6 ):
        return 1;
      case (sum < 16 ):
        return 2;
      default:
        return 3;
      }
  };

  const rating = countRating(hours);

  const result =  {
    periodLength: hours.length,
    trainingDays: hours.filter(i => i > 0).length,
    target: target,
    average: countAverage(hours),
    success: (rating >= target),
    rating: rating,
    ratingDescription: ratings[rating-1]
  };

  return result;
};

try {
  const {target, hours} = parseArguments(process.argv);
  console.log(calculateExercises(hours, target));
} catch (e: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  console.log('Error, something bad happened, message: ', e.message);
}
