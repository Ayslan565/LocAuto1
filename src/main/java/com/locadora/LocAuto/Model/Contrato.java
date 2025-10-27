    package com.locadora.LocAuto.Model;

    public class Contrato {
        private Integer ID_Contrato;
        public Integer getID_Contrato() {
            return ID_Contrato;
        }

        public void setID_Contrato(Integer iD_Contrato) {
            ID_Contrato = iD_Contrato;
        }

        private Funcionario funcionario;
        private Carro carro;
        private Cliente cliente;

        public Funcionario getFuncionario() {
            return funcionario;
        }

        public void setFuncionario(Funcionario funcionario) {
            this.funcionario = funcionario;
        }

        public Carro getCarro() {
            return carro;
        }

        public void setCarro(Carro carro) {
            this.carro = carro;
        }

        public Cliente getCliente() {
            return cliente;
        }

        public void setCliente(Cliente cliente) {
            this.cliente = cliente;
        }
//Falta Construtor (PREGUIÇA)

        @Override
        public String toString() {
            return "Contrato{" +
                    "funcionario=" + funcionario +
                    ", carro=" + carro +
                    ", cliente=" + cliente +
                    '}';
        }
    }
