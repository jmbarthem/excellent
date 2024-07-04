import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-produto-form',
  templateUrl: './produto-form.component.html',
  styleUrls: ['./produto-form.component.scss']
})
export class ProdutoFormComponent implements OnInit {
  @Input() produto: any = {};
  @Input() modal!: NgbModalRef;
  produtoForm!: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.produto.id;
    this.produtoForm = this.fb.group({
      descricao: [this.produto.descricao || '', Validators.required],
      valor_venda: [this.produto.valor_venda || '', Validators.required],
      estoque: [this.produto.estoque || '', Validators.required],
      imagens: ['']
    });
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.produtoForm.get('imagens')!.setValue(event.target.files);
    }
  }

  onSubmit(): void {
    if (this.produtoForm.invalid) {
        return;
    }

    const produtoData = {
        descricao: this.produtoForm.get('descricao')!.value,
        valor_venda: this.produtoForm.get('valor_venda')!.value,
        estoque: this.produtoForm.get('estoque')!.value
    };

    console.log('Dados do formulário antes do envio:', produtoData);

    if (this.isEdit) {
        this.apiService.updateProduto(this.produto.id, produtoData).subscribe(
            (response) => {
                console.log('Produto atualizado com sucesso', response);
                this.modal.close('save');
            },
            (error) => {
                console.error('Erro ao atualizar produto', error);
            }
        );
    } else {
        this.apiService.addProduto(produtoData).subscribe(
            (response) => {
                console.log('Produto salvo com sucesso', response);
                this.modal.close('save');
            },
            (error) => {
                console.error('Erro ao salvar produto', error);
                this.produtoForm.reset();
            }
        );
    }
}


  closeModal() {
    this.modal.dismiss();
  }
}
