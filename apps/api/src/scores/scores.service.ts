import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { CreateScore, UpdateScore, Score } from '@repo/schemas';

@Injectable()
export class ScoresService {
  private scores: Score[] = [
    {
      id: randomUUID(),
      title: 'Вехади',
      composer: 'Петър Дънов',
      lyricist: 'Петър Дънов',
      description: 'описание',
      location: 'София, Изгрев',
      category: 'категория',
      color: 'red',
      key: 'd moll',
      lyrics: 'Вехади, вехади, вехади, вехади, вехади, вехади, вехади, вехади',
      createdAt: new Date('1932-01-15').toISOString(),
    },
    {
      id: randomUUID(),
      title: 'Венир, бенир',
      composer: 'Петър Дънов',
      lyricist: 'Петър Дънов',
      description: 'описание',
      location: 'София, Изгрев',
      category: 'категория',
      color: 'red',
      key: 'C dur',
      lyrics: 'Венир, бенир, венир, бенир, венир, бенир, венир, бенир',
      createdAt: new Date('1924-01-15').toISOString(),
    },
      {
      id: randomUUID(),
      title: 'Мусала',
      composer: 'Петър Дънов',
      lyricist: 'Петър Дънов',
      description: 'описание',
      location: 'София, Изгрев',
      category: 'категория',
      color: 'red',
      key: 'C dur',
      lyrics: 'Мусала, Мусала, Мусала, Мусала',
      createdAt: new Date('1924-01-15').toISOString(),
    },
  ];

  findAll(): Score[] {
    return this.scores;
  }

  findOne(id: string): Score {
    const score = this.scores.find((s) => s.id === id);
    if (!score) {
      throw new NotFoundException(`Score with id "${id}" not found`);
    }
    return score;
  }

  create(data: CreateScore): Score {
    const score: Score = {
      id: randomUUID(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    this.scores.push(score);
    return score;
  }

  update(id: string, data: UpdateScore): Score {
    const index = this.scores.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new NotFoundException(`Score with id "${id}" not found`);
    }
    this.scores[index] = { ...this.scores[index], ...data };
    return this.scores[index];
  }

  remove(id: string): void {
    const index = this.scores.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
    this.scores.splice(index, 1);
  }
}
