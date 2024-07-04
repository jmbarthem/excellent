import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProdutoFormComponent } from '../produto-form/produto-form.component';

@Component({
  selector: 'app-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent implements OnInit {
  produtos: any[] = [];
  selectedProduto: any = null;
  alertMessage: string = '';

  constructor(private apiService: ApiService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.getProdutos();
    this.alertMessage = this.apiService['alertMessage'];
  }

  getProdutos(): void {
    this.apiService.getProdutos().subscribe((data: any[]) => {
      this.produtos = data;
    });
  }

  openNewProdutoModal(): void {
    const modalRef = this.modalService.open(ProdutoFormComponent);
    modalRef.componentInstance.modal = modalRef;
    modalRef.result.then(() => {
      this.getProdutos();
      this.alertMessage = this.apiService['alertMessage'];
    });
  }

  openEditProdutoModal(produto: any): void {
    const modalRef = this.modalService.open(ProdutoFormComponent);
    modalRef.componentInstance.produto = produto;
    modalRef.componentInstance.modal = modalRef;
    modalRef.result.then(() => {
      this.getProdutos();
      this.alertMessage = this.apiService['alertMessage'];
    });
  }

  openDeleteModal(produto: any, content: any): void {
    this.selectedProduto = produto;
    this.modalService.open(content).result.then((result) => {
      if (result === 'delete') {
        this.deleteProduto();
      }
    }, (reason) => {
      // Handle dismiss reason if needed
    });
  }

  deleteProduto(): void {
    if (this.selectedProduto) {
      this.apiService.deleteProduto(this.selectedProduto.id).subscribe(() => {
        this.produtos = this.produtos.filter(produto => produto.id !== this.selectedProduto.id);
        this.alertMessage = 'Produto excluído com sucesso!';
        this.selectedProduto = null;
      });
    }
  }

  closeAlert(): void {
    this.alertMessage = '';
  }

  getImageUrl(path: string): string {
    return `/storage/${path}`;
  }
}
