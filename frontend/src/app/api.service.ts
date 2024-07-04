import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  [x: string]: any;
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  // Clientes
  getClientes(): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes`);
  }

  getCliente(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clientes/${id}`);
  }

  addCliente(cliente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/clientes`, cliente);
  }

  updateCliente(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/clientes/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clientes/${id}`);
  }

  getCnpjData(cnpj: string): Observable<any> {
    return this.http.get<any>(`https://publica.cnpj.ws/cnpj/${cnpj}`);
  }

  // Produtos
  getProdutos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/produtos`);
  }

  getProduto(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/produtos/${id}`);
  }

  addProduto(produto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/produtos`, produto);
  }

  updateProduto(id: number, produto: any): Observable<any> {
    const params = new HttpParams()
        .set('descricao', produto.descricao)
        .set('valor_venda', produto.valor_venda)
        .set('estoque', produto.estoque);

    return this.http.put(`${this.apiUrl}/produtos/${id}`, params.toString(), {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
}

  deleteProduto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/produtos/${id}`);
  }

  // Pedidos
  getPedidos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos`);
  }

  getPedido(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedidos/${id}`);
  }

  addPedido(pedido: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos`, pedido);
  }

  updatePedido(id: number, pedido: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/pedidos/${id}`, pedido);
  }

  deletePedido(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pedidos/${id}`);
  }
}
