import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-pedido-form',
  templateUrl: './pedido-form.component.html',
  styleUrls: ['./pedido-form.component.scss']
})
export class PedidoFormComponent implements OnInit {
  @Input() pedido: any;
  pedidoForm: FormGroup;
  clientes: any[] = [];
  produtos: any[] = [];

  constructor(
    private fb: FormBuilder,
    public activeModal: NgbActiveModal,
    private apiService: ApiService
  ) {
    this.pedidoForm = this.fb.group({
      cliente_id: ['', Validators.required],
      produtos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadClientes();
    this.loadProdutos();

    if (this.pedido) {
        this.pedidoForm.patchValue({
            cliente_id: this.pedido.cliente_id,
            total: this.pedido.total,
        });
        this.pedido.produtos.forEach((produto: any) => {
            this.produtosArray.push(this.createProdutoFormGroup({
                produto_id: produto.pivot.produto_id,
                quantidade: produto.pivot.quantidade,
                valor_venda: produto.pivot.valor_venda,
                subtotal: produto.pivot.subtotal
            }));
        });
    } else {
        this.addProduto();
    }
}


  loadClientes(): void {
    this.apiService.getClientes().subscribe((data: any[]) => {
      this.clientes = data;
    });
  }

  loadProdutos(): void {
    this.apiService.getProdutos().subscribe((data: any[]) => {
      this.produtos = data;
    });
  }

  get produtosArray(): FormArray {
    return this.pedidoForm.get('produtos') as FormArray;
  }

  createProdutoFormGroup(produto: any = {}): FormGroup {
    return this.fb.group({
      produto_id: [produto.produto_id || produto.id || '', Validators.required],
      quantidade: [produto.quantidade || '', Validators.required],
      valor_venda: [produto.valor_venda || produto.preco_unitario || '', Validators.required],
      subtotal: [{ value: produto.subtotal || 0, disabled: true }]
    });
  }


  addProduto(): void {
    this.produtosArray.push(this.createProdutoFormGroup());
  }

  removeProduto(index: number): void {
    this.produtosArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.pedidoForm.valid) {
      const pedidoData = {
        cliente_id: this.pedidoForm.get('cliente_id')!.value,
        produtos: this.pedidoForm.get('produtos')!.value.map((p: any) => ({
          produto_id: p.produto_id,
          quantidade: p.quantidade,
          valor_venda: p.valor_venda,
          subtotal: p.valor_venda * p.quantidade,
        })),
        total: this.pedidoForm.get('produtos')!.value.reduce((sum: number, p: any) => sum + (p.valor_venda * p.quantidade), 0),
      };

      if (this.pedido) {
        this.apiService.updatePedido(this.pedido.id, pedidoData).subscribe(
          (response) => {
            console.log('Pedido atualizado com sucesso', response);
            this.activeModal.close('save');
          },
          (error) => {
            console.error('Erro ao atualizar pedido', error);
          }
        );
      } else {
        this.apiService.addPedido(pedidoData).subscribe(
          (response) => {
            console.log('Pedido salvo com sucesso', response);
            this.activeModal.close('save');
          },
          (error) => {
            console.error('Erro ao salvar pedido', error);
          }
        );
      }
    }
  }

}
