import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: [ './hero-search.component.css' ]
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(private heroService: HeroService) {}

  // Introduce un término de búsqueda en el flujo observable
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
      // esperar 300ms después de cada pulsación antes de considerar el término
      debounceTime(300),

      // ignorar el nuevo plazo sies el mismo que el anterior

      distinctUntilChanged(),

      // cambiar a un nuevo observable de búsqueda cada vez que el término cambia
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }
}
