import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../api.service';
import { PedidoFormComponent } from '../pedido-form/pedido-form.component';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  pedidos: any[] = [];
  alertMessage: string | null = null;
  selectedPedido: any;

  constructor(private modalService: NgbModal, private apiService: ApiService) {}

  ngOnInit(): void {
    this.getPedidos();
  }

  getPedidos(): void {
    this.apiService.getPedidos().subscribe((data: any[]) => {
      this.pedidos = data;
    });
  }

  openNewPedidoModal(): void {
    const modalRef: NgbModalRef = this.modalService.open(PedidoFormComponent);
    modalRef.result.then(
      () => {
        this.getPedidos();
        this.alertMessage = 'Pedido salvo com sucesso!';
      },
      () => {}
    );
  }

  openEditPedidoModal(pedido: any): void {
    const modalRef: NgbModalRef = this.modalService.open(PedidoFormComponent);
    modalRef.componentInstance.pedido = pedido;
    modalRef.result.then(
      () => {
        this.getPedidos();
        this.alertMessage = 'Pedido atualizado com sucesso!';
      },
      () => {}
    );
  }

  openDeleteModal(pedido: any, deleteModal: any): void {
    this.selectedPedido = pedido;
    this.modalService.open(deleteModal).result.then(
      () => {
        this.deletePedido();
      },
      () => {}
    );
  }

  confirmDelete(modal: any): void {
    this.deletePedido();
    modal.close(); // Fecha o modal após confirmar a exclusão
  }

  deletePedido(): void {
    if (this.selectedPedido) {
      this.apiService.deletePedido(this.selectedPedido.id).subscribe(
        () => {
          this.getPedidos();
          this.alertMessage = 'Pedido excluído com sucesso!';
        },
        (error) => {
          console.error('Erro ao excluir pedido', error);
        }
      );
    }
  }

  closeAlert(): void {
    this.alertMessage = null;
  }
}
