import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { CnpjPipe } from './pipes/cnpj.pipe';

registerLocaleData(localePt, 'pt-BR');

import { AppComponent } from './app.component';
import { ClientesComponent } from './clientes/clientes.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';
import { ProdutoFormComponent } from './produto-form/produto-form.component';
import { PedidoFormComponent } from './pedido-form/pedido-form.component';

const routes: Routes = [
  { path: 'clientes', component: ClientesComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    ClientesComponent,
    ClienteFormComponent,
    ProdutosComponent,
    PedidosComponent,
    ProdutoFormComponent,
    PedidoFormComponent,
    CnpjPipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
