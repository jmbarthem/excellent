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
      this.pedidoForm.patchValue(this.pedido);
      this.pedido.produtos.forEach((produto: any) => {
        this.produtosArray.push(this.createProdutoFormGroup(produto));
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
      id: [produto.id || '', Validators.required],
      quantidade: [produto.quantidade || '', Validators.required],
      preco_unitario: [produto.preco_unitario || '', Validators.required]
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
      if (this.pedido) {
        this.apiService.updatePedido(this.pedido.id, this.pedidoForm.value).subscribe(
          (response) => {
            console.log('Pedido atualizado com sucesso', response);
            this.activeModal.close('save');
          },
          (error) => {
            console.error('Erro ao atualizar pedido', error);
          }
        );
      } else {
        this.apiService.addPedido(this.pedidoForm.value).subscribe(
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
