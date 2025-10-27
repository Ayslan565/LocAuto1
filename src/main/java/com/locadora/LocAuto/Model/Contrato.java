    package com.locadora.LocAuto.Model;

    public class Contrato {
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

        public Contrato(Funcionario funcionario, Carro carro, Cliente cliente) {
            this.funcionario = funcionario;
            this.carro = carro;
            this.cliente = cliente;
        }

        @Override
        public String toString() {
            return "Contrato{" +
                    "funcionario=" + funcionario +
                    ", carro=" + carro +
                    ", cliente=" + cliente +
                    '}';
        }
    }
