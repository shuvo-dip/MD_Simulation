# LAMMPS Packages and Installation

This chapter provides an overview of LAMMPS packages and guides you through the installation process.

## What is LAMMPS?

[LAMMPS](https://lammps.org) (Large-scale Atomic/Molecular Massively Parallel Simulator) is a widely used software package for molecular dynamics simulations.

## Installation Steps

Follow these steps to install LAMMPS on your system:
- Step 1: Download the LAMMPS source with [git](https://docs.lammps.org/Install_git.html)

```
git clone -b release https://github.com/lammps/lammps.git mylammps
```
- Step 2: Extract the downloaded files.
```
git checkout release      # not needed if you always stay in this branch
git checkout stable       # use one of these 4 checkout commands
git checkout develop      # to choose the branch to follow
git checkout maintenance
git pull
```

- Step 3: Build LAMMPS with [make](https://docs.lammps.org/Build_make.html)

```
cd lammps/src   # change to main LAMMPS source folder
make serial     # build a serial LAMMPS executable using GNU g++
make mpi        # build a parallel LAMMPS executable with MPI
make            # see a variety of make options
```
- Step 4: Install required lammps packages: `make ps` `make yes-all`
```
make yes-asphere
make yes-rigid
make yes-molecule
```

