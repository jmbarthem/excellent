import { Routes } from '@angular/router';
import { ClientesComponent } from './clientes/clientes.component';
import { ProdutosComponent } from './produtos/produtos.component';
import { PedidosComponent } from './pedidos/pedidos.component';
import { ClienteFormComponent } from './cliente-form/cliente-form.component';  // Novo componente para o formulário de clientes

export const routes: Routes = [
  { path: 'clientes', component: ClientesComponent },
  { path: 'clientes/new', component: ClienteFormComponent },  // Rota para adicionar novo cliente
  { path: 'produtos', component: ProdutosComponent },
  { path: 'pedidos', component: PedidosComponent },
  { path: '', redirectTo: '/clientes', pathMatch: 'full' },
];
