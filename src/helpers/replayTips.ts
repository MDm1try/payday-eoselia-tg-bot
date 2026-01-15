import { emoji } from '@grammyjs/emoji'

export const unknownCommand: [string, { parse_mode: 'HTML' }] = [
  `Вибачте, я вас не розумію ${emoji('pensive_face')}`,
  { parse_mode: 'HTML' },
]

export const unknownError = (): [string, { parse_mode: 'HTML' }] => [
  `Упс, щось пішло не так...${emoji('hushed_face')}

Спробуйте повторити операцію через кілька хвилин. 
  `,
  { parse_mode: 'HTML' },
]
