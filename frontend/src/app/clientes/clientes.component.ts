import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClienteFormComponent } from '../cliente-form/cliente-form.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit {
  clientes: any[] = [];
  selectedCliente: any = null;
  alertMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void {
    this.apiService.getClientes().subscribe((data: any[]) => {
      this.clientes = data;
    });
  }

  deleteCliente(id: number): void {
    this.apiService.deleteCliente(id).subscribe(() => {
      this.clientes = this.clientes.filter(cliente => cliente.id !== id);
      this.alertMessage = 'Cliente excluído com sucesso!';
    });
  }

  openDeleteModal(cliente: any, content: any): void {
    this.selectedCliente = cliente;
    this.modalService.open(content).result.then((result) => {
      if (result === 'delete') {
        this.confirmDelete();
      }
    }, (reason) => {
      // Handle dismiss reason if needed
    });
  }

  openNewClienteModal() {
    const modalRef = this.modalService.open(ClienteFormComponent);
    modalRef.result.then((result) => {
      if (result === 'save') {
        this.getClientes(); // Atualiza a lista de clientes após salvar
        this.alertMessage = 'Cliente salvo com sucesso!';
      }
    }).catch((error) => {
      console.error('Erro ao abrir modal de novo cliente', error);
    });
  }

  openEditClienteModal(cliente: any) {
    const modalRef = this.modalService.open(ClienteFormComponent);
    modalRef.componentInstance.cliente = cliente; // Passa o cliente selecionado para o modal
    modalRef.result.then((result) => {
      if (result === 'save') {
        this.getClientes(); // Atualiza a lista de clientes após salvar
        this.alertMessage = 'Cliente atualizado com sucesso!';
      }
    }).catch((error) => {
      console.error('Erro ao abrir modal de edição de cliente', error);
    });
  }

  confirmDelete(): void {
    if (this.selectedCliente) {
      this.apiService.deleteCliente(this.selectedCliente.id).subscribe(() => {
        this.clientes = this.clientes.filter(cliente => cliente.id !== this.selectedCliente.id);
        this.alertMessage = 'Cliente excluído com sucesso!';
        this.selectedCliente = null;
      });
    }
  }

  closeAlert() {
    this.alertMessage = '';
  }
}
