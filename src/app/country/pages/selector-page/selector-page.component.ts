import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { filter, switchMap, tap } from 'rxjs';

import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.interfaces';


@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit{

  private _countriesByRegion: SmallCountry[] = [];

  public borders:SmallCountry[] =[];

  public get countriesByRegion() {
    return this._countriesByRegion;
  }
  public set countriesByRegion(value) {
    this._countriesByRegion = value;
  }

  public myForm: FormGroup = this.fb.group({
    region:['',Validators.required],
    country:['',Validators.required],
    border:['',Validators.required]
  });

  constructor(private fb: FormBuilder,
    private countriesService: CountriesService){}

  ngOnInit(): void {

    this.onRegionChanged();
    this.onCountryChanged();
  }

  get regions():Region[] {
    return this.countriesService.regions;
  }


  onRegionChanged(): void{
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('country')!.setValue('')), // Si Cambia la región  el país a vacío
      tap( () => this.borders = []), // Si cambia la región Cambia los borders a vácio

      // switchMap -> Toma el valor del observabla anterior y va a suscribirse al nuevo observable
      switchMap( (region)=> this.countriesService.getCountriesByRegion(region) ),
    )
    .subscribe(countries =>{
      this.countriesByRegion = countries;
    });
  }


  onCountryChanged(){
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('border')!.setValue('')),
      filter( (value:string) => value.length >0), // con filter,Si lo que le decimos devuelve falso, entonces no continúa
      // con el switchMap
      switchMap( ( alphaCode )=> this.countriesService.getCountryByAlphaCode(alphaCode) ),
      switchMap( (country) => this.countriesService.getCountryBordersByCodes( country.borders ) ),
    )
    .subscribe(countries =>{
      this.borders = countries;
    });
  }

}
