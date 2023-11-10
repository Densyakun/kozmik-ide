import * as Diff from 'diff';

export function getReplacedText(oldProgram: string, oldProgramAndComments: string, newProgram: string) {
  console.log({oldProgram, oldProgramAndComments, newProgram});

  let newProgramAndComments = '';

  const diff1 = Diff.diffChars(oldProgram, newProgram);
  const diff2 = Diff.diffChars(oldProgram, oldProgramAndComments);
  let start2 = 0;
  let end2 = 0;
  let i2 = 0;
  for (let i = 0; i < diff1.length; i++) {
    const part1 = diff1[i];

    if (!part1.added) {
      end2 += part1.value.length;

      while (start2 < end2 && i2 < diff2.length) {
        if (diff2[i2].added)
          newProgramAndComments += diff2[i2].value;
        else
          start2 += diff2[i2].value.length;

        i2++;
      }
    }

    if (!part1.removed)
      newProgramAndComments += part1.value;
  }

  while (i2 < diff2.length) {
    if (diff2[i2].added)
      newProgramAndComments += diff2[i2].value;

    i2++;
  }

  return newProgramAndComments;
}