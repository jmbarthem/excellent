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

  addProduto(produto: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/produtos`, produto, {
      headers: new HttpHeaders().set('Accept', 'application/json')
    });
  }

  updateProduto(id: number, produto: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/produtos/${id}?_method=PUT`, produto, {
      headers: new HttpHeaders().set('Accept', 'application/json')
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
    const pedidoData = {
      cliente_id: pedido.cliente_id,
      produtos: pedido.produtos.map((p: any) => ({
        produto_id: p.id,
        quantidade: p.quantidade,
        valor_venda: p.preco_unitario,
        subtotal: p.preco_unitario * p.quantidade
      })),
      total: pedido.produtos.reduce((sum: number, p: any) => sum + (p.preco_unitario * p.quantidade), 0)
    };

    return this.http.put(`${this.apiUrl}/pedidos/${id}`, pedidoData, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }


  deletePedido(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/pedidos/${id}`);
  }
}
