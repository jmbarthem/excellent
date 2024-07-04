import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent implements OnInit {
  @Input() cliente: any; // Recebe o cliente a ser editado, se houver
  clienteForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    public activeModal: NgbActiveModal
  ) {
    this.clienteForm = this.fb.group({
      razao_social: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.pattern('[0-9]{14}')]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (this.cliente) {
      // Preenche o formulário com os dados do cliente
      this.clienteForm.patchValue({
        razao_social: this.cliente.razao_social,
        cnpj: this.cliente.cnpj,
        email: this.cliente.email
      });
    }
  }

  onCnpjBlur(): void {
    const cnpj = this.clienteForm.get('cnpj')?.value;
    if (cnpj && cnpj.length === 14) {
      this.apiService.getCnpjData(cnpj).subscribe(
        (data: any) => {
          this.clienteForm.patchValue({
            razao_social: data.razao_social || '',
            email: data.estabelecimento.email || ''
          });
        },
        (error) => {
          console.error('Erro ao buscar dados do CNPJ', error);
        }
      );
    }
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      if (this.cliente) {
        // Atualiza o cliente existente
        this.apiService.updateCliente(this.cliente.id, this.clienteForm.value).subscribe(
          (response) => {
            console.log('Cliente atualizado com sucesso', response);
            this.activeModal.close('save');
          },
          (error) => {
            console.error('Erro ao atualizar cliente', error);
          }
        );
      } else {
        // Adiciona um novo cliente
        this.apiService.addCliente(this.clienteForm.value).subscribe(
          (response) => {
            console.log('Cliente salvo com sucesso', response);
            this.activeModal.close('save');
          },
          (error) => {
            console.error('Erro ao salvar cliente', error);
            this.clienteForm.reset();
          }
        );
      }
    }
  }

  onCancel(): void {
    this.activeModal.dismiss('cancel');
  }
}
